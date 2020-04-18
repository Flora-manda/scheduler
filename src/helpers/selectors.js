function getAppointmentsForDay(state, day) {
  let result = [];
  for (let eachDay of state.days) {
    if (eachDay.name === day) {
      for (let eachApptId of eachDay.appointments) {
        result.push(state.appointments[eachApptId]);
      }
    }
  }
  return result;
}

function getInterviewersForDay(state, day) {
  let result = [];
  for (let eachDay of state.days) {
    if (eachDay.name === day) {
      for (let eachInterviewertId of eachDay.interviewers) {
        result.push(state.interviewers[eachInterviewertId]);
      }
    }
  }
  return result;
}

/// METHOD 2 BELOW //////

// export function getAppointmentsForDay(state, day) {
//   let dayFound = state.days.find((dayItem) => dayItem.name === day);
//   //console.log("DAY FOUND", dayFound);
//   if (!dayFound) {
//     return [];
//   } else if (dayFound) {
//     let appointments = dayFound.appointments.map(
//       (dayApptId) => state.appointments[dayApptId]
//     );
//     return appointments;
//   }
// }

// "3": {
// id: 3,
// time: "2pm",
// interview: { student: "Archie Cohen", interviewer: 2 },

function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const individualInterviewer = state.interviewers[interview.interviewer];

  const newInterviewObj = {
    student: interview.student,
    interviewer: individualInterviewer,
  };
  return newInterviewObj;
}

module.exports = { getAppointmentsForDay, getInterviewersForDay, getInterview };
