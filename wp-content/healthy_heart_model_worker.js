importScripts("https://cdn.jsdelivr.net/pyodide/v0.28.1/full/pyodide.js");

let pyodide;

async function loadPyodideAndPackages() {
    pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.1/full/"
    });

    // Your Python code here...
    await pyodide.runPython(
' \n \
from math import sin, exp, pi \n \
import json \n \
 \n \
PRESSURE_INDEX_MAP = [ \n \
    "Pressure Left Ventricle", \n \
    "Pressure Aorta", \n \
    "Pressure Vena Cava", \n \
    "Pressure Right Atrium", \n \
    "Pressure Right Ventricle", \n \
    "Pressure Pulmonary Artery", \n \
    "Pressure Pulmonary Vein", \n \
    "Pressure Left Atrium", \n \
] \n \
 \n \
VOLUME_INDEX_MAP = [ \n \
    "Volume Left Ventricle", #9 \n \
    "Volume Aorta", \n \
    "Volume Vena Cava", \n \
    "Volume Right Atrium", \n \
    "Volume Right Ventricle", \n \
    "Volume Pulmonary Artery", \n \
    "Volume Pulmonary Vein", \n \
    "Volume Left Atrium", \n \
] \n \
 \n \
DROPDOWN_MAP_NAME = ["Time"] + PRESSURE_INDEX_MAP + VOLUME_INDEX_MAP \n \
 \n \
DROPDOWN_UNITS_MAP = ["ms"] + ["mmHg"] * len(PRESSURE_INDEX_MAP) + ["mL"] * len(VOLUME_INDEX_MAP) \n \
 \n \
UNITS_MAP = { \n \
    "volume" : "mL", \n \
    "resting volume" : "mL", \n \
    "pressure" : "mmHg", \n \
    "resistance" : "Pa ms/mL", \n \
    "compliance" : "mL/Pa", \n \
} \n \
 \n \
class Value: \n \
    def __init__(self, value: float, type: str, full_name: str): \n \
        self.value = value \n \
        self.type = type \n \
        self.units = UNITS_MAP[type.lower()] \n \
        self.full_name = f"{full_name} {type} ({self.units})" \n \
 \n \
    def __set__(self, instance): \n \
        self.value = instance.Value \n \
 \n \
class BivenLVADModel: \n \
    def __init__(self): \n \
        self.VLV   = Value(50,    "Volume", "Left Ventricle")  #initial guess - Volume Left Ventricle \n \
        self.Vart  = Value(700,   "Volume", "Aorta")  #initial guess - Volume Aorta \n \
        self.Vvc   = Value(3200,  "Volume", "Vena Cava")  #initial guess - Vena Cava \n \
        self.Vra   = Value(12.5,  "Volume", "Right Atrium")  #initial guess - Right Atrium \n \
        self.VRV   = Value(62,    "Volume", "Right Ventricle")  #initial guess - Right Ventricle \n \
        self.Vpa   = Value(175,   "Volume", "Pulmonary Artery")  #initial guess - Pulmonary Artery \n \
        self.Vpu   = Value(375,   "Volume", "Pulmonary Vein")  #initial guess - Pulmonary Vein \n \
        self.Vla   = Value(12.5,  "Volume", "Left Atrium")  #initial guess - Left Atrium \n \
        self.Rao   = Value(500,   "Resistance", "Aortic valve")  #Aortic valve resistance \n \
        self.Rvc   = Value(2000,  "Resistance", "Vena Cava resistance")  #Vena Cava resistance \n \
        self.Rper  = Value(150000,"Resistance", "Peripheral resistance")  #Peripheral resistance \n \
        self.Rtv   = Value(200,   "Resistance", "Tricuspid valve resistance")  #Tricuspid valve resistance \n \
        self.Rpv   = Value(250,   "Resistance", "Pulmonary valve resistance")  #Pulmonary valve resistance \n \
        self.Rpul  = Value(18000, "Resistance", "Pulmonary Artery resistance")  #Pulmonary Artery resistance \n \
        self.Rpu   = Value(1500,  "Resistance", "Pulmonary vein resistance")  #Pulmonary vein resistance \n \
        self.Rmv   = Value(150,   "Resistance", "Mitral valve resistance")  #Mitral valve resistance \n \
        self.Rin   = Value(25,    "Resistance", "Inlet cannula resistance (LVAD)")  #Inlet cannula resistance (LVAD) \n \
        self.Rout  = Value(50,    "Resistance", "Outlet cannula resistance (LVAD)")  #outlet cannula resistance (LVAD) \n \
        self.Cao   = Value(0.014, "Compliance", "Aortic Compliance")  #Aortic Compliance \n \
        self.Cvc   = Value(0.5,   "Compliance", "Venous Compliance")  #Venous Compliance \n \
        self.Cpa   = Value(0.035, "Compliance",  "Pulmonary artery compliance")  # Pulmonary artery compliance \n \
        self.Cpu   = Value(0.08,  "Compliance", "Pulmonary vein compliance")  #Pulmonary vein compliance \n \
        self.Vart0 = Value(530,   "Resting Volume", "Arterial")  #Resting volume of arteries \n \
        self.Vvc0  = Value(2900,  "Resting Volume", "Venous")  #Resting volume of venous \n \
        self.Vpa0  = Value(30,    "Resting Volume", "Pulmonary Artery")  #Resting volume of pulmonary artery \n \
        self.Vpu0  = Value(250,   "Resting Volume", "Pulmonary Vein")  #Resting volume of pulmonary vein \n \
 \n \
    @staticmethod \n \
    def e(t, Tmax, tau): \n \
        if t <= 1.5*Tmax: \n \
            return 0.5 * (sin((pi/Tmax) * t - pi/2) + 1) \n \
        else: \n \
            return 0.5 * exp((-t + (1.5*Tmax))/tau) \n \
 \n \
    #Closed loop bi-ventricular circulatory model with LVAD \n \
    def calculate(self, use_LVAD, output_full = False): \n \
        e = self.e \n \
 \n \
        dt = 2 \n \
        t = list(range(0, 27000 + 1, dt)) #0:2:27000 \n \
        Vol = [[0 for _ in t] for __ in range(8)] # zeros(length(t),8) \n \
            # Vol[0]: VLV  - Volume Left Ventricle \n \
            # Vol[1]: Vart - Volume Aorta \n \
            # Vol[2]: Vvc  - Vena Cava \n \
            # Vol[3]: Vra  - Right Atrium \n \
            # Vol[4]: VRV  - Right Ventricle \n \
            # Vol[5]: Vpa  - Pulmonary Artery \n \
            # Vol[6]: Vpu  - Pulmonary Vein \n \
            # Vol[7]: Vla  - Left Atrium \n \
 \n \
        Prs = [[0 for _ in t] for __ in range(8)] # zeros(length(t),8) \n \
            # Prs[0]: PLV  - Volume Left Ventricle \n \
            # Prs[1]: Part - Volume Aorta \n \
            # Prs[2]: Pvc  - Vena Cava \n \
            # Prs[3]: Pra  - Right Atrium \n \
            # Prs[4]: PRV  - Right Ventricle \n \
            # Prs[5]: Ppa  - Pulmonary Artery \n \
            # Prs[6]: Ppu  - Pulmonary Vein \n \
            # Prs[7]: Pla  - Left Atrium \n \
 \n \
        VLV =   self.VLV.value \n \
        Vart =  self.Vart.value \n \
        Vvc =   self.Vvc.value \n \
        Vra =   self.Vra.value \n \
        VRV =   self.VRV.value \n \
        Vpa =   self.Vpa.value \n \
        Vpu =   self.Vpu.value \n \
        Vla =   self.Vla.value \n \
        Rao =   self.Rao.value \n \
        Rvc =   self.Rvc.value \n \
        Rper =  self.Rper.value \n \
        Rtv =   self.Rtv.value \n \
        Rpv =   self.Rpv.value \n \
        Rpul =  self.Rpul.value \n \
        Rpu =   self.Rpu.value \n \
        Rmv =   self.Rmv.value \n \
        Rin =   self.Rin.value \n \
        Rout =  self.Rout.value \n \
        Cao =   self.Cao.value \n \
        Cvc =   self.Cvc.value \n \
        Cpa =   self.Cpa.value \n \
        Cpu =   self.Cpu.value \n \
        Vart0 = self.Vart0.value \n \
        Vvc0 =  self.Vvc0.value \n \
        Vpa0 =  self.Vpa0.value \n \
        Vpu0 =  self.Vpu0.value \n \
 \n \
        ti = 0      #Time \n \
        cycle_LV = 1 \n \
        cycle_RV = 1 \n \
        cycle_la = 1 \n \
        cycle_ra = 1 \n \
        cycle_time = 900 \n \
 \n \
        for i in range(len(t)): #i=1:1:length(t) \n \
            Part = 1/Cao*(Vart - Vart0) \n \
            Pvc = 1/Cvc*(Vvc - Vvc0) \n \
            Ppa = 1/Cpa*(Vpa - Vpa0) \n \
            Ppu = 1/Cpu*(Vpu - Vpu0) \n \
 \n \
            # For calculating PLV \n \
            Ees_LV = 400 \n \
            A_LV = 173.33 \n \
            B_LV = 0.027 \n \
            V0_LV = 5 \n \
            Tmax_LV = 200 \n \
            tau_LV = 30 \n \
            f_LV = ti % cycle_time \n \
            if (f_LV == 0): \n \
                cycle_LV = ti/900 \n \
 \n \
            t_LV = ti-cycle_LV*900 \n \
            PLV = e(t_LV,Tmax_LV,tau_LV) * Ees_LV * (VLV - V0_LV) + (1 - e(t_LV,Tmax_LV,tau_LV)) * A_LV * (exp(B_LV*(VLV - V0_LV)) - 1) \n \
 \n \
            # For Calculating PRV \n \
            Ees_RV = 81.32 \n \
            A_RV = 26.66 \n \
            B_RV = 0.03 \n \
            V0_RV = 5 \n \
            Tmax_RV = 200 \n \
            tau_RV = 30 \n \
            f_RV = ti % cycle_time \n \
            if (f_RV == 0): \n \
                cycle_RV = ti/900 \n \
            t_RV = ti-cycle_RV*900 \n \
            PRV = e(t_RV,Tmax_RV,tau_RV) * Ees_RV * (VRV - V0_RV) + (1 - e(t_RV,Tmax_RV,tau_RV)) * A_RV * (exp(B_RV*(VRV - V0_RV)) - 1) \n \
    #         if ti == 0 \n \
    #             PRV = 250 \n \
    #         end \n \
 \n \
            # For Calculating Pla \n \
            Ees_la = 60 \n \
            A_la = 58.67 \n \
            B_la = 0.049 \n \
            V0_la = 10 \n \
            Tmax_la = 200 \n \
            tau_la = 55 \n \
            f_la = (ti+200) % cycle_time \n \
            if f_la == 0: \n \
                cycle_la = (ti+200)/900 + 1 \n \
 \n \
            if ti < 700: \n \
                t_la = 0 \n \
            else: \n \
                t_la = ti-(cycle_la-1)*900 + 200 \n \
 \n \
            Pla = e(t_la,Tmax_la,tau_la) * Ees_la * (Vla - V0_la) + (1 - e(t_la,Tmax_la,tau_la)) * A_la * (exp(B_la*(Vla - V0_la)) - 1) \n \
 \n \
            #For Calcualting Pra \n \
            Ees_ra = 60 \n \
            A_ra = 58.67 \n \
            B_ra = 0.049 \n \
            V0_ra = 10 \n \
            Tmax_ra = 225 \n \
            tau_ra = 65 \n \
            f_ra = (ti+200) % cycle_time \n \
            if f_ra == 0: \n \
                cycle_ra = (ti+200)/900 + 1 \n \
 \n \
            if ti < 700: \n \
                t_ra = 0 \n \
            else: \n \
                t_ra = ti-(cycle_ra-1)*900 + 200 \n \
 \n \
            Pra = e(t_ra,Tmax_ra,tau_ra) * Ees_ra * (Vra - V0_ra) + (1 - e(t_ra,Tmax_ra,tau_ra)) * A_ra * (exp(B_ra*(Vra - V0_ra)) - 1) \n \
 \n \
            #conditions for Valves \n \
            if(PLV <= Part):    #Aortic valve \n \
                Qao = 0 \n \
            else: \n \
                Qao = 1/Rao*(PLV - Part) \n \
 \n \
            if(PLV >= Pla): #Mitral valve \n \
                Qla = 0 \n \
            else: \n \
                Qla = 1/Rmv*(Pla - PLV) \n \
 \n \
            if(PRV <= Ppa):  #Pulmonary valve \n \
                Qpv = 0 \n \
            else: \n \
                Qpv = 1/Rpv*(PRV - Ppa) \n \
 \n \
            if(PRV >= Pra): #Tricuspid valve \n \
                Qra = 0 \n \
            else: \n \
                Qra = 1/Rtv*(Pra - PRV) \n \
 \n \
            QLVAD = 0 \n \
            if use_LVAD: QLVAD = 1/(Rin + Rout)*7.05 #0.97*(-0.0256*0.007500617*(PLV - Part)+3.2)/60 \n \
            #Qao = 1/Rao*(PLV - Part) \n \
            Qper = 1/Rper*(Part - Pvc) \n \
            Qvc = 1/Rvc*(Pvc - Pra) \n \
            Qpu = 1/Rpu*(Ppu - Pla) \n \
            Qpul = 1/Rpul*(Ppa - Ppu) \n \
 \n \
            VLV = VLV + dt*(Qla - Qao - QLVAD) \n \
            Vart = Vart + dt*(Qao + QLVAD - Qper) \n \
            Vvc = Vvc + dt*(Qper - Qvc) \n \
            Vra = Vra + dt*(Qvc - Qra) \n \
            VRV = VRV + dt*(Qra - Qpv) \n \
            Vpa = Vpa + dt*(Qpv - Qpul) \n \
            Vpu = Vpu + dt*(Qpul - Qpu) \n \
            Vla = Vla + dt*(Qpu - Qla) \n \
 \n \
            Vol[1 - 1][i] = VLV \n \
            Vol[2 - 1][i] = Vart \n \
            Vol[3 - 1][i] = Vvc \n \
            Vol[4 - 1][i] = Vra \n \
            Vol[5 - 1][i] = VRV \n \
            Vol[6 - 1][i] = Vpa \n \
            Vol[7 - 1][i] = Vpu \n \
            Vol[8 - 1][i] = Vla \n \
 \n \
            Prs[1 - 1][i] = PLV \n \
            Prs[2 - 1][i] = Part \n \
            Prs[3 - 1][i] = Pvc \n \
            Prs[4 - 1][i] = Pra \n \
            Prs[5 - 1][i] = PRV \n \
            Prs[6 - 1][i] = Ppa \n \
            Prs[7 - 1][i] = Ppu \n \
            Prs[8 - 1][i] = Pla \n \
 \n \
            ti = ti + dt \n \
 \n \
        final_cycle_start = 26100 \n \
        output_indexes = slice(t.index(final_cycle_start), -1)  # to get the very last cycle \n \
        Prs = [[i * 0.007500617 for i in row] for row in Prs]  # update units \n \
        if output_full: \n \
            return t, Prs, Vol \n \
 \n \
        return [i - final_cycle_start for i in t[output_indexes]], [i[output_indexes] for i in Prs], [i[output_indexes] for i in Vol] \n \
 \n \
def generate_data(data, use_LVAD = False): \n \
    simModel = BivenLVADModel() \n \
    try: \n \
        print(data["parameters"].items()) \n \
        for key, value in data["parameters"].items(): \n \
            simModel.__dict__[key].value = float(value) \n \
 \n \
        axes = tuple(map(int, data["axis"].split())) \n \
        axes = tuple(zip(axes[::2], axes[1::2])) \n \
 \n \
        time, pressures, volumes = simModel.calculate(use_LVAD) \n \
        dropdown_map = [time] + pressures + volumes \n \
 \n \
        plots = [None for _ in range(len(axes))] \n \
        for i, (x, y) in enumerate(axes): \n \
            plots[i] = [[f"{DROPDOWN_MAP_NAME[x]} ({DROPDOWN_UNITS_MAP[x]})", f"{DROPDOWN_MAP_NAME[y]} ({DROPDOWN_UNITS_MAP[y]})"]] \n \
            x_arr = tuple(dropdown_map[x]) \n \
            y_arr = tuple(dropdown_map[y]) \n \
            plots[i] += [None for i in range(len(x_arr))] \n \
            for j, (a, b) in enumerate(zip(x_arr, y_arr)): \n \
                plots[i][j + 1] = [a, b] \n \
 \n \
        return str(json.dumps(plots)) \n \
 \n \
    except Exception as e: \n \
        print(e.with_traceback()) \n \
        return {"data": "error"} \n \
'
);
}


self.onmessage = async function(e) {
    pyodide.setDebug(true);
    console.log("Worker recieved request! Data is; " + e.data);
    const {requestId, args} = e.data;
    
    try {
        console.log('Starting PyOdide processing...');

        const result = await pyodide.runPython("generate_data(" + args + ")");
        
        console.log('PyOdide processing complete:', result);
        
        self.postMessage({
            type: 'complete',
            result: result,
            requestId: requestId
        });
        
    } catch (error) {
        console.log('Error during processing:', error);
        self.postMessage({
            type: 'error',
            result: error.toString(),
            requestId: requestId       // Include requestId in error responses too
        });
    }
};

loadPyodideAndPackages();