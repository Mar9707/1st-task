const http = require('http');//server stexcelu hamar
const fs = require('fs');//brauzer veradardzvox fayleri het ashxatanqi hamar
const formidable = require('formidable');
const path = require('path');//ognum e voroshel chisht chanaparh@

const PORT = 3000;

const server = http.createServer((req, res) => { // vorpes argument @ndunum e callback funkcya, vor@ kkanchvi amen angam, erb serverin inch vor harcum kuxarkvi
//henc funckcyan @ndunum e 2 argument, harcman obyekt@, ev patasxan@, request@ karox e pahpanel info vor@ menq karox enq ogtagorcel mer serverum
console.log('Server request');
res.setHeader('Content-Type', 'text/html'); //sa voroshum e te serveri uxarkac patasxan@(content-type) inch formatov cuyc ta brauzerum, ays depqum html formatov cuyc kta

const method = req.method;

if (method == 'GET'){
	GetRequest(req.url, res);
} else if (method == 'POST'){
	PostRequest(req, res);
} else if (method == 'DELETE'){
	DeleteRequest(req, res);
}
});


function GetRequest(url, res) {
 	let basePath = ''; //pahum e html fayli chanaparh@ vor@ uxarkvum e vorpes harcman@ patasxan

	switch(url) {//mshakvum e harcum@
		case '/':
		case '/home':
		case '/index.html':
			basePath = createPath('index');
			res.statusCode = 200;
			break;
		case '/contacts':
			basePath = createPath('contacts');
			res.statusCode = 200;
			break;
		case '/about-us':
			res.statusCode = 301;
			res.setHeader('Location', '/contacts');
			res.end();
			break;
		default:
			basePath = createPath('error');
			res.statusCode = 404;
			break;
	}

	fs.readFile(basePath, (err, data) => { //server@ kardum e HTML fayl@ ev veradardznum e harman@ patasxan
          if(err){
                 console.log(err);
                 res.statusCode = 500;
                 res.end();
         } else {
                 res.write(data);
                 res.end();
         }
	 });	
}



function PostRequest(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error uploading file:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        const uploadedFile = files.file;

        if (!uploadedFile || !uploadedFile.path) { // Проверяем, что uploadedFile и uploadedFile.path определены
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('No file uploaded');
            return;
        }

        const oldPath = uploadedFile.path;
        const fileSize = uploadedFile.size;

        const fileId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const newFolderPath = path.join(__dirname, 'uploads');
        const newFilePath = path.join(newFolderPath, fileId + path.extname(uploadedFile.name));

        if (!fs.existsSync(newFolderPath)) {
            fs.mkdirSync(newFolderPath, { recursive: true });
        }

        fs.rename(oldPath, newFilePath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error moving file');
                return;
            }

            const responseData = { id: fileId };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseData));
        });
    });
}

module.exports = { PostRequest };




function handleDeleteRequest(req, res) {
  console.log('Received DELETE request');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('DELETE request received');
}



function createPath(page) {
	return path.resolve(__dirname, 'views', `${page}.html`);
}


server.listen(PORT, 'localhost', (error) => {
	error ? console.log(error) : console.log('Listening port ' + PORT);
}); //cuyc enq talis te vor portin petq e server@ lsi
