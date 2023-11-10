import launchesDatabase from "./launches.mongo.js";
import planets from './planets.mongo.js'
import axios from "axios";

const DEFAULT_FLIGH_NUMBER = 100;

async function findLaunch(filter){
  return await launchesDatabase.findOne(filter);
}

export async function existLaunchWithId(launchId) {
  return await findLaunch({flightNumber:launchId})
}

export async function scheduleNewLaunch(launch){
  const planet = await planets.findOne({
    keplerName:launch.target
  })

  if(!planet) throw new Error("No matching planet was found!");

  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch,{
    success:true,
    upcoming:true,
    customers:['SUPARCO','NASA'],
    flightNumber:newFlightNumber
  });

  await saveLaunch(newLaunch);
}

async function getLatestFlightNumber(){
  const latestLaunch = await launchesDatabase
  .findOne()
  .sort('-flightNumber');
  
  if(!latestLaunch) return DEFAULT_FLIGH_NUMBER;

  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
  console.log("Downloading data..");
  const response = await axios.post(SPACEX_API_URL,{

    query:{},
    options:{
        pagination:false,
        populate:[
            {
                path:'rocket',
                select:{
                    name:1
                }
            },
            {
              path:'payloads',
              select:{
                'customers':1
              }
            }
        ]
    }
  } )

  if(response.status != 200){
    console.log(response.status);
    console.log("Problem downloading the data...");
    throw new Error("Launch data download failed");
  }

const launchDocs = response.data.docs;
for (const launchDoc of launchDocs) {
  const payloads = launchDoc['payloads'];
  const customers = payloads.flatMap((payload)=>{
    return payload['customers'];
  });

  const launch = {
    flightNumber: launchDoc['flight_number'],
    mission: launchDoc['name'],
    rocket: launchDoc['rocket']['name'],
    launchDate: launchDoc['date_local'],
    upcoming: launchDoc['upcoming'],
    success: launchDoc['success'],
    customers,
  };
  
  console.log(`${launch.flightNumber} ${launch.mission}`);
  
  await saveLaunch(launch);
}

}

export async function loadLaunchData(){
  const firstLaunch = await findLaunch({
    flightNumber:1,
    rocket:"Falcon 1",
    mission:"FalconSat"
  });

if(firstLaunch){
  console.log("Data loaded");
}else{
  await populateLaunches();
}
}

export async function getAllLaunches(skip,limit) {
  return await launchesDatabase.find({},{ '_id': 0, '__v':0  })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}
export async function abortedLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId
  },{
    upcoming:false,
    success:false
  });
  return aborted.modifiedCount === 1;
  
}

