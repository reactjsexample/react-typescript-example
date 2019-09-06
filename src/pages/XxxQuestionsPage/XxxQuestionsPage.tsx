import * as React from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { CircularProgress, IconButton } from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import queryString from "query-string";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";

import sharedStyles from "../../assets/styles/XxxSharedStyles.module.scss";
import styles from "./XxxQuestionsPage.module.scss";

export interface XxxQuestionsPagePropsInterface extends RouteComponentProps {}

export interface XxxQuestionsPageStateInterface {
  currentPage: string;
  isEmpty: boolean;
  isError: boolean;
  isLoading: boolean;
  isMorePages: boolean;
  questions: any[];
}

class XxxQuestionsPage extends React.Component<
  XxxQuestionsPagePropsInterface,
  XxxQuestionsPageStateInterface
> {
  // BEST PRACTICE: declare all private properties at the top
  pageBaseUrl = "/questions";
  requestedPage = "";
  title = "";
  unlisten: any;

  constructor(props: XxxQuestionsPagePropsInterface) {
    super(props);
    this.state = {
      currentPage: "",
      isEmpty: false,
      isError: false,
      isLoading: true,
      isMorePages: false,
      questions: []
    };
    // bind event handlers so we can refer to the this object
    this.handleFirstPage = this.handleFirstPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePreviousPage = this.handlePreviousPage.bind(this);
  }

  componentDidMount() {
    this.readUrlQueryString(this.props.location.search);
    this.getQuestions();
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen(location => {
      this.readUrlQueryString(location.search);
      this.getQuestions();
    });
  }

  readUrlQueryString(search: string) {
    const values = queryString.parse(search);
    if (typeof values.title === "string") {
      this.title = values.title;
    }
    if (typeof values.page === "string") {
      this.requestedPage = values.page;
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  getQuestions() {
    this.setState({
      isEmpty: false,
      isError: false,
      isLoading: true
    });
    const baseUrl = "https://api.stackexchange.com/2.2/search/advanced";
    const requestParams = {
      key: "U4DMV*8nvpm3EOpvf69Rxw((",
      title: this.title || "",
      answers: "1",
      site: "stackoverflow",
      filter: "withbody",
      page: this.requestedPage || "1",
      order: "desc",
      sort: "votes"
    };
    const url = baseUrl + "?" + this.getQueryString(requestParams);
    const thisRef = this;
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          thisRef.setState({
            isError: true,
            isLoading: false
          });
          return;
        }
        response.json().then(data => {
          if (
            typeof data === "object" &&
            data.hasOwnProperty("items") &&
            Array.isArray(data.items) &&
            data.items.length > 0
          ) {
            thisRef.setState({
              currentPage: requestParams.page,
              isLoading: false,
              isMorePages: data.has_more,
              questions: data.items
            });
          } else {
            thisRef.setState({
              isEmpty: true,
              isLoading: false
            });
          }
        });
      })
      .catch(function() {
        thisRef.setState({
          isError: true,
          isLoading: false
        });
      });
  }

  getQueryString(params: any) {
    return Object.keys(params)
      .map(
        key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
      )
      .join("&");
  }

  decodeHtmlEntities(text: string) {
    if (text === undefined || text === "") {
      return "";
    }
    const doc = new DOMParser().parseFromString(text, "text/html");
    let newText: string = "";
    if (typeof doc.documentElement.textContent === "string") {
      newText = doc.documentElement.textContent;
    }
    newText = newText.replace("&quot;", '"');
    return newText;
  }

  handleFirstPage() {
    this.requestedPage = "1";
    this.navigateToPage();
  }

  handleNextPage() {
    this.requestedPage = (parseInt(this.state.currentPage, 10) + 1).toString();
    this.navigateToPage();
  }

  handlePreviousPage() {
    this.requestedPage = (parseInt(this.state.currentPage, 10) - 1).toString();
    this.navigateToPage();
  }

  navigateToPage() {
    const queryParams = {
      title: this.title,
      page: this.requestedPage
    };
    this.props.history.push(
      this.pageBaseUrl + "?" + this.getQueryString(queryParams)
    );
  }

  render() {
    let pageView = null;
    if (this.state.isLoading) {
      pageView = (
        <div className={sharedStyles.pageMessageContainer}>
          <CircularProgress />
        </div>
      );
    }
    if (this.state.isError) {
      pageView = (
        <div className={sharedStyles.pageMessageContainer}>
          <div className={sharedStyles.pageMessageError}>
            Error Occurred Getting Questions
          </div>
        </div>
      );
    }
    if (this.state.isEmpty) {
      pageView = (
        <div className={sharedStyles.pageMessageContainer}>
          <div className={sharedStyles.pageMessageWarning}>
            No Questions Found
          </div>
        </div>
      );
    }
    if (!(this.state.isEmpty || this.state.isError || this.state.isLoading)) {
      pageView = (
        <div>
          <ul>
            {this.state.questions.map(item => (
              <li key={item.question_id}>
                <a
                  href={
                    process.env.PUBLIC_URL + "/#/answers/" + item.question_id
                  }
                  className={styles.dummy}
                  key={item.question_id}
                >
                  {this.decodeHtmlEntities(item.title)}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.pageFooter}>
            <div className={styles.pageNavigationPanel}>
              <span>Page {this.state.currentPage}</span>
              <IconButton
                disabled={this.state.currentPage === "1"}
                onClick={this.handleFirstPage}
                href="#"
                title="Go to First Page"
              >
                <FirstPageIcon />
              </IconButton>
              <IconButton
                disabled={this.state.currentPage === "1"}
                onClick={this.handlePreviousPage}
                href="#"
                title="Go to Previous Page"
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                disabled={!this.state.isMorePages}
                onClick={this.handleNextPage}
                href="#"
                title="Go to Next Page"
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={sharedStyles.page}>
        <div className={sharedStyles.pageTitle}>Stack Exchange Questions</div>
        <div className={sharedStyles.mainCard}>{pageView}</div>
      </div>
    );
  }
}

export default withRouter(XxxQuestionsPage);
