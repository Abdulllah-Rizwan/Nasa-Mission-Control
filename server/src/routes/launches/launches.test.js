import request from 'supertest';
import {app} from '../../app.js';
import { mongoConnect,mongoDisconnect } from '../../services/mongo.js';
import { loadPlanetsData } from '../../models/planets.models.js';

describe("Launches API", () => {
    beforeAll(async()=>{
        await mongoConnect();
        await loadPlanetsData();
    },1000);

    afterAll(async()=>{
        await mongoDisconnect();
    });

    describe("Testing GET /launches",()=> {
        test("Should return response as 200 success ",async () =>{
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        });
    });
    
    
    describe("Testing POST /launches",() => {
    
        const completeLaunchData = {
            mission:"Kepler Exploration x",
            rocket:"Is21",
            target:"Kepler-62 f",
            launchDate: "November 17, 2026"
        }
        
        const launchDataWithoutDate = {
            mission:"Kepler Exploration x",
            rocket:"Is21",
            target:"Kepler-62 f"
        }
    
        const launchDataWithInvalidDate = {
            mission:"Kepler Exploration x",
            rocket:"Is21",
            target:"Kepler-62 f",
            launchDate: "heyaaa"
        }
    
        test("Should return response 201 created", async () =>{
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            
            expect(response.body).toMatchObject(launchDataWithoutDate);
    
        });
    
        test("Should catch missing required properties",async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('content-type',/json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error:"Missing required launch property"
            });
        });
    
        test("It should catch invalid dates", async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('content-type', /json/)
            .expect(400)
            
            expect(response.body).toStrictEqual({
                error:"Invalid launch date"
            });
        });
    });
})

