import React from "react";
import "./clock.css";
import { format } from "date-fns";
import taqwaImage from "../images/TAQWA.png";

export default function Clock() {
  return (
    <div>
      <div className="wrapper">
        <div className="watch-strap">
          <div className="strap-circle"></div>
          <div className="strap"></div>
          <div className="watch-strap-holder left-up"></div>
          <div className="watch-strap-holder left-bottom"></div>
          <div className="watch-strap-holder right-up"></div>
          <div className="watch-strap-holder right-bottom"></div>
          <div className="watch-lace">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <span className="top"></span>
            <span className="bottom"></span>
          </div>
        </div>
        <div className="watch-case">
          <div className="reflection"></div>
          <div className="reflection bottom"></div>
          <div className="watch-center">
            <div className="watch-points">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div className="watch-tips">
              <span className="hours"></span>
              <span className="minutes"></span>
              <span className="seconds"></span>
            </div>
            <div className="watch-date">{format(new Date(), "do MMM")}</div>
            <div className="watch-alert">
              <img src={taqwaImage} alt="TQWA" className="w-24" />
            </div>
            <div className="watch-week">
              <span className="week-arrow"></span>
              <ul>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
              </ul>
            </div>
            <div className="watch-day">
              <div className="sun">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
