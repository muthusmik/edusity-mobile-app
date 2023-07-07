import axios from "axios";
import { webinarListUrl, generateWebinarTokenUrl, courseAnnouncementUrl, testListUrl, upcommingWebniarsUrl, studentStatisticsUrl, baseUrl, forumUrl } from "./constant";
import moment from "moment/moment";

export const getWebinars = async (Token, page) => {
  // const Token=useSelector(state=>state.loginHandle.data.data);

  const now = new Date();
  const firstDay = moment(
    new Date(now.getFullYear(), now.getMonth(), 1)
  ).format("YYYY MM,DD");
  const lastDay = moment(
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
  ).format("YYYY MM,DD");

  return await axios
    // .get(`${webinarListUrl}`, { headers: { Authorization: `Bearer ${Token}` } })
    .get(baseUrl + `webinar/all?startDate=${firstDay}&endDate=${lastDay}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {

      return response.data;
    })
    .catch((res) => {
      // console.log(res);
      return (res)
    });
};

export const generateWebinarToken = async (Token, id) => {

  return await axios
    .get(baseUrl + `webinar/join?webinarId=${id}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
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
      // console.log("getList..............", response);
      return response.data
    })
    .catch((error) => {
      console.log("Catch inside the testListUrl.......", error);
    })
}

export const getForumData = async (Token) => {
  return await axios.get(`${forumUrl}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      return response.data
    }).catch((error) => {
      console.log("Catch inside the getForumData.......", error);
    })
}

export const getForumComment = async (Token, valueId) => {
  let url = forumUrl + "/" + `${valueId}`;
  return await axios.get(`${url}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      return response.data
    }).catch((error) => {
      console.log("Catch inside the getForumComment.......", error);
      return "error"
    })
}

export const getForumCommentDelete = async (Token, valueId) => {
  let url = forumUrl + "/" + `${valueId}`;
  return await axios.delete(`${url}`, { headers: { Authorization: `Bearer ${Token}` } })
    .then(response => {
      return response.data
    }).catch((error) => {
      console.log("Catch inside the getForumCommentDelete.......", error);
      return "error"
    })
}