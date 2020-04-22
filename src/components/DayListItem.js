import React from "react";
import "components/DayListItem.scss";
const classNames = require("classnames");

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0,
  });

  const formatSpots = () => {
    let spotDescription = `${props.spots} spots remaining`;

    if (props.spots === 0) {
      spotDescription = "no spots remaining";
    } else if (props.spots === 1) {
      spotDescription = "1 spot remaining";
    }

    return <h3 className="text--light">{spotDescription}</h3>;
  };

  return (
    <li className={dayClass} onClick={props.setDay} data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      {formatSpots()}
    </li>
  );
}
