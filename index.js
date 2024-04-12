
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variable  need ???

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){
    //jab clicked tab current tab se diffrent hoga tbhi to tab switch karege
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
          //kya search form vala container invisible , if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehle search wale tab pe tha, ab your weather wale tab pe jane ke liye click kiya hai isliye hme use visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mein your weather tab me agya hu, to weather bhi dispaly karna padega , so let's check local storage first 
            //for coordinates , if we have saved them there .
            getfromSessionStorage();  
        }
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
     switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter 
     switchTab(searchTab);
})

// check if coordinates are already present in session storage
function  getfromSessionStorage(){
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if(!localCoordinates){
            // agar local coordinates nhi mile to 
            grantAccessContainer.classList.add("active");
        }
        else{
            const coordinates =JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
}

 async function fetchUserWeatherInfo(coordinates){
    const{lat , lon } = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    
    //now make loader visible to show that data is coming from API
    loadingScreen.classList.add("active");

    //API CALL
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data =  await response.json();

        //data agya hai ab to loading screen hata do
          loadingScreen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
       
        }
    catch{
        loadingScreen.classList.remove("active");
      // what to do ???
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly fetch the objects required from dom
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // now fetch the data from the obtained  object  after API call and append it into the variables upper fetched 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${ weatherInfo?.clouds?.all} %`;
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

function getLocation(){
    if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an error for no geolocational area 
    }
}

function showPosition(position){

    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[data-searchInput]");
 
 searchForm.addEventListener("click",(e)=>{
       e.preventDefault();
       let cityName = searchInput.value;

       if(cityName==="")
       return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
 })

  async function fetchSearchWeatherInfo(city){
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");

        try{
             const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
        catch(err){
           // how to handle with the error given if 
        }
        
 }