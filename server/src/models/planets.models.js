import { parse } from "csv-parse";
import fs from "fs";
import path,{dirname} from "path";
import { fileURLToPath } from "url";
import planets from './planets.mongo.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

export const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname,"..","..","data","Kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("error", (err) => {
        console.log(err.message);
        reject(err);
      })
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("end", async () => {
        const countPlanets = (await getAllPlanets()).length;
        console.log(
          `${countPlanets} are the habitable planets found`
        );
        resolve();  
      });
  });
};

export const getAllPlanets = async () => {
  return await planets.find({},
    {
      '_id':0,
      '__v':0
    });
}

const savePlanet = async(planet)=>{
 try {
  await planets.updateOne({
    keplerName: planet.kepler_name
  },{
    keplerName: planet.kepler_name
  },{
    upsert:true
  });
 } catch (error) {
  console.error(`couldn't save the planet ${planet}`);
 }
}

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};
