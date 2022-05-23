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
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
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
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let settingsFromFile = req.files.settingsfile;

            //send response
            res.json(JSON.parse(settingsFromFile.data.toString()))
            
            // res.send({
            //     status: true,
            //     message: 'File is uploaded',
            //     data: {
            //         name: avatar.name,
            //         mimetype: avatar.mimetype,
            //         size: avatar.size
            //     }
            // });
        }
    } catch (err) {
        res.status(500).send(err);
    }
  })

  app.post('/search', async (req, res) => {
          console.log(req.body.searchTerm)

        const octokit = new Octokit({
                auth: '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'
              })
              
            let dataFromGh = await octokit.request(`GET /search/repositories?q=${req.body.searchTerm}&per_page=10`, {})

   console.log(dataFromGh.data)
      res.json(dataFromGh.data)
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})