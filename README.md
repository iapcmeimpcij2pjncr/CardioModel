<h3>This is where all the files for the full wordpress website is stored.</h3>

<h4>To use/modify this website:</h4>

>1. Download Local from https://localwp.com
>2. Open the application and press the plus icon in the bottom left of the app
>3. Go to the folder where sites are stored (should be <code>C:\Users\[your name]\Local Sites\\</code>)
>4. Add this repository to a new folder inside <code>\Local Sites\\</code>
>5. Open Local, then run website from Local, and then hit the button labeled "WP Admin" to go to WP Admin Dashboard.
>    - If it asks you to log in, the username is <code>admin</code>, and the password is <code>43UukHVhcMhoi0</code>
>5. From there, you should be able to edit the website like a normal wordpress website.


<h4>To export a static page to GitHub:</h4>

>1. Open the WP Admin Dashboard 
>2. Hover over Simply Static on the left menu, and then click Generate
>    - Note: the settings for Generation should already be set
>3. After Simply Static is done, you can go to Activity Log and press a link to download a ZIP containing the static page
>4. Before uploading, you have to edit the JavaScript slightly
>    1. Uncompress the ZIP
>    2. Navigate to /healthy-model/index.html
>    3. Edit the file using an editor of your choice
>    4. Find the line reading <code>simulation_worker = new Worker('/wp-content/healthy_heart_model_worker.js');</code>
>    4. Replace it with <code>simulation_worker = new Worker('/CardioModel/wp-content/healthy_heart_model_worker.js');</code>
>5. Now the folder is ready to be uploaded to GiHub as a static webpage.
>    - Static webpages should first be uploaded to the dev branch and then tested, and if they work you can then move the webpage to main branch.
