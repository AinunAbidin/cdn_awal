const express = require('express')
const app = express()
const hbs = require('hbs')
var getIP = require('ipware')().get_ip;
var router = express.Router();
const path = require('path')
const requestIp = require('request-ip');
const ipMiddleware = function(req, res, next) {
  const clientIp = requestIp.getClientIp(req); 
  next();
};

const view_path = path.join(__dirname, './Public/views')
const public_path = path.join(__dirname, 'Public/')

app.set('view engine', 'hbs');
app.set('views',view_path)


app.use(requestIp.mw())
var trusted_proxies = ['177.144.11.100', '177.144.11.101'];
app.use(function(req, res, next) {
    var ip_info = getIP(req, trusted_proxies);
    console.log(ip_info);
    // { clientIp: '177.100.44.22', clientIpRoutable: true }
    next();
});

app.use(express.static(public_path));
app.get('/', function (req, res) {
  console.log(req.header)
  var ipaddress = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
  res.render('index', {
    ip: ipaddress
  })
})
 
app.listen(process.env.PORT || 8080)
