import * as React from "react";

import logo from "../../assets/images/logo.svg";
import styles from "./XxxHeader.module.scss";
import XxxSearchBox from "../XxxSearchBox/XxxSearchBox";

class XxxHeader extends React.Component {
  render() {
    return (
      <div className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <div className={styles.headerTitle}>React TypeScript Example</div>
        <div className={styles.searchBoxContainer}>
          <XxxSearchBox />
        </div>
      </div>
    );
  }
}

export default XxxHeader;
