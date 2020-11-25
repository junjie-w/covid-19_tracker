import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './InfoBox.css'

//export const InfoBox = ({ title, cases, total, active, isRed, ...props }) => {
export const InfoBox = ({ title, cases, total, active, covidCases, recovered, deaths, ...props }) => {
  return (
    //<Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
    <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${covidCases && "infoBox__cases__border"} ${recovered && "infoBox__recovered__border"} ${deaths && "infoBox__deaths__border"}`}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        {/*<h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>*/}
        <h2 className={`infoBox__cases ${covidCases && "infoBox__cases__text"} ${recovered && "infoBox__recovered__text"} ${deaths && "infoBox__deaths__text"}`}>
          {cases}
        </h2>
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}
