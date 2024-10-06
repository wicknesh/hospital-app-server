import express from 'express';
const router = express.Router();
import fs from 'fs-extra';

function loadHospiceData() {
    try {
        return JSON.parse(fs.readFileSync('hospiceData.json', 'utf-8'));
    } catch (error) {
        console.log(error);
        return [];
    }
};

function saveHospiceData(hospiceData) {
    try {
        const dataJSON = JSON.stringify(hospiceData, null, 2);
        fs.writeFileSync('hospiceData.json', dataJSON);
    } catch (error) {
        console.log(error);
    }
}

//Display
router.get('/', (req, res) => {
    const hospiceData = loadHospiceData();
    res.send(hospiceData);
});

//Add
router.post('/', (req, res) => {
    try {
        const hospiceData = loadHospiceData();
        const newHospiceData = {
            id: hospiceData.length + 1,
            name: req.body.name,
            patientCount: req.body.patientCount,
            hospiceLocation: req.body.hospiceLocation || []
        };
        hospiceData.push(newHospiceData);
        saveHospiceData(hospiceData);
        res.status(201).send(newHospiceData);
    } catch (error) {
        res.status(400).send(error);
    }
})

//Update
router.patch('/:id', (req, res) => {
    try {
        const hospiceData = loadHospiceData();
        const hospice = hospiceData.find(i => (i.id === parseInt(req.params.id)));

        if(!hospice){
            return res.status(404).send({error: "Hospital not found"});
        }

        hospice.name = req.body.name || hospice.name;
        hospice.patientCount = req.body.patientCount || hospice.patientCount;
        hospice.hospiceLocation = req.body.hospiceLocation || hospice.hospiceLocation;

        saveHospiceData(hospiceData);
        res.status(200).send(hospice);
    } catch (error) {
        res.status(400).send(error);
    }
})

//Delete
router.delete('/:id', (req, res) => {
    try {
        const hospiceData = loadHospiceData();
        const index = hospiceData.findIndex(i => (i.id === parseInt(req.params.id)));

        if(index === -1) {
            req.status(404).send({error: "Hospital not found"});
        }

        hospiceData.splice(index, 1);
        saveHospiceData(hospiceData);
        res.send({message: 'Hospital deleted'})
    } catch (error) {
        res.status(404).send();
    }
})

export default router;