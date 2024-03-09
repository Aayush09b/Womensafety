require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const ejs = require('ejs');

const saltRounds = 10;
const port = process.env.port ||3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
// Connect to MongoDB


async function main() {
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/feedback_db');
        await mongoose.connect(process.env.DATABASE , { useNewUrlParser: true, connectTimeoutMS: 30000 });
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}



// Define a schema for the feedback
const feedbackSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    contact_number: String,
    feedback_message: String
});
const incidentSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    contact_number: String,
    time: String,
    date:String,
    location: String,
    feedback_message: String
   
   
});

const expirenceSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    contact_number: String,
    feedback_message: String
});

const counsellingSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    contact_number: String
});
const policeSchema = new mongoose.Schema({
   case_no: String,
   inspecter_name: String,
   University_name: String,
    status: String
});

const requestSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    contact_number: String,
    university_name:String,
    feedback_message: String   
});
const Incident = mongoose.model('Incident', incidentSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Experience = mongoose.model('Experience', expirenceSchema);
const Counselling = mongoose.model('Counselling',counsellingSchema);
const Police = mongoose.model('Police', policeSchema);
const Request = mongoose.model('Request', requestSchema);






app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'landing_page.html'));
});
app.get('/women_dashbord.html', async (req, res) => {
      
    res.sendFile(path.join(__dirname, 'women_dashbord.html'));
});

app.get("/authority_login_page", (req, res) => {
    res.sendFile(path.join(__dirname, 'authority_login_page.html'));
});


app.get("/women_login", (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});


app.get('/submit_incident', (req, res) => {
    res.sendFile(path.join(__dirname, 'submit_incident.html'));
});

app.get('/expirence', (req, res) => {
    res.sendFile(path.join(__dirname, 'expirence.html'));
});

app.get('/Feedback', (req, res) => {
    res.sendFile(path.join(__dirname, 'Feedback.html'));
});

app.get('/community', (req, res) => {
    res.redirect('http://localhost:4000/');
});

app.get('/submit_counselling', (req, res) => {
    res.sendFile(path.join(__dirname, 'counselling.html'));
});

//post requests to database

app.post('/submit_feedback', async function (req, res) {
    try {
        const newFeedback = new Feedback({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact_number: req.body.contact_number,
            feedback_message: req.body.feedback_message
        });

        await newFeedback.save();
        res.redirect('/women_dashbord.html');
    }
    catch (err) {
        res.send('Error submitting feedback');
        console.error(err);
    }
    
});

app.post('/submit_incident', async function (req, res) {
    try {
        const newIncident = new Incident({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact_number: req.body.contact_number,
            feedback_message: req.body.feedback_message,
            time:req.body.time,
            date:req.body.date,
            location:req.body.location
        });

        await newIncident.save();

        // Emit an SSE event to notify the dashboard
        sseSend('New incident submitted!');

        res.redirect('/women_dashbord.html');
    }
    catch (err) {
        res.send('Error submitting feedback');
        console.error(err);
    }
});

// Store SSE clients
let sseClients = [];

// Function to send SSE
function sseSend(data) {
    console.log('Sending SSE:', data); // Add this line
    sseClients.forEach(client => client.res.write(`data: ${JSON.stringify(data)}\n\n`));
}


// SSE endpoint
app.get('/sse', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.write('\n');

    sseClients.push({ req, res });

    // Remove disconnected clients
    req.on('close', () => {
        sseClients = sseClients.filter(client => client.req !== req);
    });
});


app.post('/submit_experince', async function (req, res) {
    try {
        const newExperience = new Experience({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact_number: req.body.contact_number,
            feedback_message: req.body.feedback_message
        });

        await newExperience.save();
        res.redirect('/women_dashbord.html');
    }
    catch (err) {
        res.send('Error submitting feedback');
        console.error(err);
    }
    
});


app.post('/counselling', async function (req, res) {
    try {
        const newCounselling = new Counselling({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact_number: req.body.contact_number
          
        });

        await newCounselling.save();
        res.redirect('/women_dashbord.html');
    }
    catch (err) {
        res.send('Error submitting feedback');
        console.error(err);
    }
    
});





//login backend code

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DATABASE1 , { useNewUrlParser: true, connectTimeoutMS: 30000 });
}

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    Name: String
});


const User = mongoose.model('User', UserSchema);

app.post("/register",  function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        // Store hash in your password DB.
        try {
            const newUser = new User({
                email: req.body.username,
                password: hash,
                Name:req.body.Name
            });
          
            await newUser.save();
    
            res.redirect('/women_dashbord.html');
            
        } catch (err) {
            console.error(err);
        }
    });
  
});

app.post("/login", async function (req, res) {
    try {
        const foundUser = await User.findOne({ Name: req.body.Name }).timeout(30000);
        
        if (foundUser) {
            const result =await  bcrypt.compare(req.body.password, foundUser.password);

            if (result) {
                res.redirect('/women_dashbord.html');
            } else {
                res.redirect('/login.html');
             
            }
        }
        else {
            console.error("err");
            res.send("error");
        }
    } catch (err) {
        console.error("err");
        res.send("error 404");
        // Handle any other errors (e.g., send an error response)
    }
});



main();

// campus dashboard

app.get('/campus_login', async function(req, res) {
    try{
   const incidents = await Incident.find({}, 'first_name  last_name feedback_message  contact_number time date');
    
   res.render('campus_dashboard', { data: incidents });
    }
    catch (error) {
        console.error(error);
        res.send('Error fetching data');
    }
});

app.get('/request_police', async function(req, res) { 
    res.sendFile(path.join(__dirname, 'request_police.html'));
});


app.get('/police_dashboard', async function(req, res) {
    try{
   const incidents = await Incident.find({}, 'first_name  last_name feedback_message  contact_number time date');
    
   res.render('police_dashboard', { data: incidents });
    }
    catch (error) {
        console.error(error);
        res.send('Error fetching data');
    }
});


app.get('/Counselling_service', async function(req, res) {
    try{
   const counselling = await Counselling.find({}, 'first_name  last_name  contact_number email');
    
   res.render('counselling', { data: counselling });
    }
    catch (error) {
        console.error(error);
        res.send('Error fetching data');
    }
});

app.post("/request_police", async function (req, res) {
    try {
        const newRequest = new Request({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            contact_number: req.body.contact_number,
            university_name: req.body.university_name,
            feedback_message: req.body.feedback_message
        });

        await newRequest.save();
        const data = []; // Assuming you have data to pass to the template
        res.render('campus_dashboard', { data }); // Make sure to pass data here
    } catch (err) {
        res.send('Error submitting feedback');
        console.error(err);
    }
});





// polic dasboard backend

app.get('/victim_info', async function(req, res) {
    try{
   const counselling = await Incident.find({}, 'first_name  last_name  contact_number email feedback_message');
    
   res.render('victim_info', { data: counselling });
    }
    catch (error) {
        console.error(error);
        res.send('Error fetching data');
    }
});

app.get('/edit_response', async function(req, res) {
        res.sendFile(path.join(__dirname, 'edit_response.html'));
});


app.get('/Investigation_Support', async function(req, res) {
    try{
   const support = await Request .find({}, 'first_name  last_name  contact_number     university_name feedback_message');
   res.render('investigation_support',{data:support});
    }
    catch (error) {
        console.error(error);
        res.send('Error fetching data');
    }
});


app.get('/multiple_aggency', async function(req, res) {
    try{
   const police = await Police.find({}, 'case_no inspecter_name University_name');
    
   res.render('multiple_aggency', { data: police });
    }
    catch (error) {
        console.error(error);
        res.send('Error fetching data');
    }
});

app.get('/case_tracking', async function(req, res) {
    try{
   const police = await Police.find({}, 'case_no inspecter_name University_name status');
    
   res.render('Case_tracking', { data: police });
    }
    catch (error) {
        console.error(error);
        res.send('Error fetching data');
    }
});


app.post('/investigation', async function (req, res) {
    try {
        const newPolice = new Police({
            case_no: req.body.case_no,
            inspecter_name:req.body.inspecter_name,
            University_name:req.body.University_name,
            status:req.body.status
        });

        await newPolice.save();
        // res.redirect('http://localhost:3000/police_dashboard');
       
        res.redirect('/police_dashboard')
    }
    catch (err) {
        res.send('Error submitting feedback');
        console.error(err);
    }   
});






app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
