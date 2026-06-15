const https = require('https');

https.get('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=760428', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const summary = JSON.parse(data);
    const comp = summary.header.competitions[0];
    const c0 = comp.competitors[0].team;
    console.log("Header team 0 logo:", c0.logo, "logos:", c0.logos ? c0.logos[0].href : 'no logos');
    const b0 = summary.boxscore.teams[0].team;
    console.log("Boxscore team 0 logo:", b0.logo, "logos:", b0.logos ? b0.logos[0].href : 'no logos');
  });
});
