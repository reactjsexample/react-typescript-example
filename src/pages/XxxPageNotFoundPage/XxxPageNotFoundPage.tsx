import * as React from "react";
import sharedStyles from "../../assets/styles/XxxSharedStyles.module.scss";

class XxxPageNotFoundPage extends React.Component {
  render() {
    return (
      <div className={sharedStyles.page}>
        <div className={sharedStyles.pageTitle}>Page Not Found</div>
        <div className={sharedStyles.mainCard}>
          <p>
            The requested page at this address is not found.{" "}
            <a href="/">Home Page</a>
          </p>
        </div>
      </div>
    );
  }
}

export default XxxPageNotFoundPage;
