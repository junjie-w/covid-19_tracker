import React, { useEffect, useState } from "react";
import './App.css';
import { Card, CardContent, FormControl, MenuItem, Select } from "@material-ui/core";
import { InfoBox } from "./components/InfoBox";
import { Map } from "./components/Map";
import { LineGraph } from "./components/LineGraph";
import { Table } from './components/Table';
import { sortData, prettyPrintStat } from "./components/util";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";

function App() {
  const [globalInfo, setGlobalInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  //const [mapCenter, setMapCenter] = useState({ lat: 55.3781, lng: -3.4360 });
  //const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  //const [mapCenter, setMapCenter] = useState({ lat: 51.4934, lng: 0.0098 });
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  //const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: 0.0098 });
  //const [mapZoom, setMapZoom] = useState(3);
  //const [mapZoom, setMapZoom] = useState(3.5);
  const [mapZoom, setMapZoom] = useState(2.35);
  //const [flyTo, setFlyTo] = useState([34.8076, -40.4796])

  useEffect(() => {
    const getGlobalData = async () => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then(data => setGlobalInfo(data));
    }
    getGlobalData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const dataCountries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const filteredCountries = dataCountries.filter(country => country.value !== null);
          setCountries(filteredCountries);
          setMapCountries(data);
          let sortedData = sortData(data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  console.log("casesType >>>", casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setGlobalInfo(data);
        countryCode === "worldwide" ? setMapCenter([34.80746, 0.0098]) : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        //setMapCenter(countryCode === "worldwide" ? [34.80746, -40.4796] : [data.countryInfo.lat, data.countryInfo.long]) && setMapZoom(countryCode === "worldwide" ? 2.35 : 3.5);
        countryCode === "worldwide" ? setMapZoom(2.35) : setMapZoom(3.785);
        //setFlyTo(countryCode === "worldwide" ? [34.8076, -40.4796] : [data.countryInfo.lat, data.countryInfo.long], countryCode === "worldwide" ? 2.35 : 3.5)
      });
  };

  console.log("GlobalInfo >>>", globalInfo)

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className="app__title">COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={e => setCasesType("cases")}
            title="Coronavirus Cases"
            //isRed
            covidCases
            active={casesType === "cases"}
            cases={prettyPrintStat(globalInfo.todayCases)}
            total={numeral(globalInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={e => setCasesType("recovered")}
            title="Recovered"
            recovered
            active={casesType === "recovered"}
            cases={prettyPrintStat(globalInfo.todayRecovered)}
            total={numeral(globalInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={e => setCasesType("deaths")}
            title="Deaths"
            //isRed
            deaths
            active={casesType === "deaths"}
            cases={prettyPrintStat(globalInfo.todayDeaths)}
            total={numeral(globalInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3 className="lineGraphTitle">Worldwide New {casesType.charAt(0).toUpperCase() + casesType.slice(1)}</h3>
            <LineGraph casesType={casesType} />
            <h3 className="tableTitle">Live Cases by Country</h3>
            <Table countries={tableData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
