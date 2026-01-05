let map, heatLayer, roadLayer, barChart, lineChart;
let liveInterval=null;

// INIT MAP
document.addEventListener("DOMContentLoaded",()=>{
  map=L.map("map").setView([12.9716,77.5946],13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
   .addTo(map);

  heatLayer=L.heatLayer(lowTraffic(),{
    radius:40, blur:30,
    gradient:{0.0:"green",0.5:"blue",1.0:"red"}
  }).addTo(map);

  drawRoads("green");
  initCharts();
});

// DRAW ROADS
function drawRoads(color){
  if(roadLayer) map.removeLayer(roadLayer);
  roadLayer=L.layerGroup([
    L.polyline([[12.9716,77.5946],[12.975,77.6]],{color,weight:8}),
    L.polyline([[12.9716,77.5946],[12.965,77.585]],{color,weight:8})
  ]).addTo(map);
}

// CHARTS
function initCharts(){
  barChart=new Chart(barChartCtx(),{
    type:"bar",
    data:{
      labels:["Low","Medium","High"],
      datasets:[{data:[70,20,10],backgroundColor:["green","blue","red"]}]
    },
    options:{scales:{y:{beginAtZero:true,max:100}}}
  });

  lineChart=new Chart(lineChartCtx(),{
    type:"line",
    data:{
      labels:["Now","15","30","60"],
      datasets:[{
        data:[20,30,40,55],
        borderColor:"#0f766e", fill:true, tension:.4
      }]
    }
  });
}

// MANUAL
function manualPredict(){
  simulatePredict(
    +density.value,
    +speed.value,
    weather.value
  );
}

// MOCK PREDICT (NO BACKEND)
function simulatePredict(d,s,w){
  let congestion;

  if(d>120 || s<30 || w==="Rainy") congestion="High";
  else if(d>70) congestion="Medium";
  else congestion="Low";

  result.innerText="Predicted Congestion: "+congestion;
  result.className=congestion.toLowerCase();

  if(congestion==="High"){
    heatLayer.setLatLngs(highTraffic());
    drawRoads("red");
    updateCharts([10,20,70],[60,80,95,100]);
  }else if(congestion==="Medium"){
    heatLayer.setLatLngs(mediumTraffic());
    drawRoads("blue");
    updateCharts([25,50,25],[40,55,65,75]);
  }else{
    heatLayer.setLatLngs(lowTraffic());
    drawRoads("green");
    updateCharts([70,20,10],[20,25,30,35]);
  }

  updateStats(congestion);
}

// LIVE (10 sec)
function startLive(){
  stopLive();
  liveInterval=setInterval(()=>{
    density.value=random(30,160);
    speed.value=random(15,70);
    weather.value=Math.random()>0.7?"Rainy":"Clear";
    manualPredict();
  },10000);
}
function stopLive(){ clearInterval(liveInterval); }

// STATS
function updateStats(level){
  lastUpdated.innerText=new Date().toLocaleString();
  const today=level==="High"?65:level==="Medium"?45:25;
  const week=level==="High"?42:level==="Medium"?35:28;
  todayTraffic.innerText=`${level} (${today}%)`;
  weekTraffic.innerText=`Avg ${week}%`;
}

// HELPERS
function updateCharts(b,l){
  barChart.data.datasets[0].data=b; barChart.update();
  lineChart.data.datasets[0].data=l; lineChart.update();
}
function lowTraffic(){return[[12.9716,77.5946,0.2]];}
function mediumTraffic(){return[[12.9716,77.5946,0.5],[12.975,77.6,0.5]];}
function highTraffic(){return[[12.9716,77.5946,1],[12.98,77.61,1]];}
const barChartCtx=()=>document.getElementById("barChart");
const lineChartCtx=()=>document.getElementById("lineChart");
const random=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
