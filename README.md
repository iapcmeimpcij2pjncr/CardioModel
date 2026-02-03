<h1>Wordpress-full</h1>
<p>This branch contains the folder "..[website folder]\app\public\wp-content", which contains all the necessary files to modify the website using WordPress</p>
<h1>How to download website</h1>
<p>
  <li>Download LocalWP from <code><a href=https://localwp.com/>https://localwp.com/</a></code>.</li>
  <li>Open LocalWP and create a website from scratch. The name and login details can be whatever you want.</li>
  <li>Select the website from the Local sites tab, and click on "site folder" (should be right under the title of the site).</li>
  <li>Navigate to <code>..[website folder]\app\public\wp-content</code>, and replace the <code>wp-content</code> folder with the wp-content folder in this branch.</li>
  <li>Return to Local WP and start up the website.</li>
</p>
<h1>How to use with /dev branch</h1>
<p>
  <li>Go to the Simply Static extension (or install it if it's not already there)</li>
  <li>Export all the files to a ZIP.
    <ul>
      <li>If it's taking an unusual amount of time or skipping files, you may have to switch the webserver in Local WP from <code>nginx</code> to <code>Apache</code>.</li>
    </ul>
  </li>
  <li>Download the ZIP and extract all.</li>
  <li>Place the contents into the Github repository, replacing all previous files.</li>
  <li>Commit the changes like any other repository. The website should automatically refresh.</li>
</p>
