'use strict'
const express = require('express');
const Docker = require('dockerode');
const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const cors = require('cors');

const app = express();
const port = 4200;

app.use(cors({
    origin: '*'
}));

app.get('/generate-sbom/:image', async (req, res) => {
  try {
    const imageName = req.params.image;

    if (!imageName) {
      return res.status(400).json({ error: 'Please provide the Docker image name.' });
    }

    // Create a Docker client
    // const docker = new Docker();

    // Pull the Docker image
    // await docker.pull(imageName);

    // Inspect the image to get metadata
    // const image = await docker.getImage(imageName).inspect();

    // Run 'docker-slim' to generate a detailed report
    const command = `trivy image --format cyclonedx ${imageName}`;
    const { stdout } = await exec(command);

    // Save the SBOM report with the image name as the filename
    // const reportFilename = `${imageName}_sbom.json`;
    // fs.writeFileSync(reportFilename, stdout);

    // console.log(`SBOM report saved as ${reportFilename}`);

    // res.download(reportFilename, () => {
    //   fs.unlinkSync(reportFilename);
    // });

    const sbomReport = JSON.stringify(stdout);

    res.json({ sbomReport });
  } catch (error) {
    console.error('Error generating SBOM:', error);
    res.status(500).json({ error: 'Error generating SBOM' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
