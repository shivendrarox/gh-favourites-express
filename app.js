const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const fileUpload = require('express-fileupload');
const port = 3000
const { Octokit, App } = require("octokit");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// enable files upload
app.use(fileUpload());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://gh-search-three.vercel.app"); // or "http://localhost:3000" 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/generate-settings', (req, res) => {
    let settingsFromUser=req.body;
    res.set({"Content-Disposition":"attachment; filename=settings.json"});
   res.send(settingsFromUser);
  })

  app.post('/import-settings', (req, res) => {
      console.log(req.files)
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {

            let settingsFromFile = req.files.settingsfile;

            //send response
            res.json(JSON.parse(settingsFromFile.data.toString()))
        }
    } catch (err) {
        res.status(500).send(err);
    }
  })

        const octokit = new Octokit({
                auth: '--------------------'
              })
              
  app.post('/search', async (req, res) => {
          console.log(req.body.searchTerm)

            let dataFromGh = await octokit.request(`GET /search/repositories?q=${req.body.searchTerm}&per_page=10`, {})

   console.log(dataFromGh.data)
      res.json(dataFromGh.data)
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})