import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { webinarListUrl, generateWebinarTokenUrl, courseAnnouncementUrl, testListUrl, upcommingWebniarsUrl, studentStatisticsUrl } from "./constant";
import { Platform } from "react-native";
import { View } from "react-native";

export const getWebinars = async (Token, page) => {
  // const Token=useSelector(state=>state.loginHandle.data.data);
  return await axios
    .get(`${webinarListUrl}`, { headers: { Authorization: `Bearer ${Token}` } })
    // .get(`https://dev-login.edusity.com/webinar/all?startDate=2023%2005,01&endDate=2023%2005,31`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      console.log("Webinar Courses inside the webinar.js api calling resonse.........", response.data);
      console.log("URL used is.......", `${webinarListUrl}`);
      return response.data;

    })
    .catch((res) => {
      // console.log(res);
      return (res)
    });
};

export const generateWebinarToken = async (Token, id) => {

  return await axios
    .get(`${generateWebinarTokenUrl}${id}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      // console.log("Webinal generate token url......,"`${generateWebinarTokenUrl}${id}`)
      console.log("Webinar Token.......", response.data);

      return response.data;

    })
    .catch((res) => {
      console.log("Catch of the generateWebinarToken......", res);
      return (res)
    });
};

export const getCourseAnnouncement = async (Token) => {
  return await axios.get(`${courseAnnouncementUrl}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      return response.data
    })
    .catch((error) => {
      console.log("Catch in annoucement url......", error)
    })
}

export const getStudentStatistics = async (Token) => {
  return await axios.get(`${studentStatisticsUrl}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      return response.data
    })
    .catch((error) => {
      console.log("Catch inside the student statictics.......", error);
    })
}

export const getUpcommingWebniars = async (Token) => {
  return await axios.get(`${upcommingWebniarsUrl}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      return response.data
    })
    .catch((error) => {
      console.log("Catch inside theupcommingWebniarsUrl.......", error);
    })
}

export const getTestList = async (Token) => {
  return await axios.get(`${testListUrl}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      console.log("Response for testListUrl........", response)
      return response
    })
    .catch((error) => {
      console.log("Catch inside the testListUrl.......", error);
    })
}