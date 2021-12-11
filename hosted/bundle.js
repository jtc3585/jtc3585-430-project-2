"use strict";

var handleStop = function handleStop(e) {
  e.preventDefault();
  $("#stopMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#stopName").val() == '' || $("#stopAddress").val() == '' || $("#stopDispatch").val() == '') {
    handleError("STOP! All fields are required");
    return false;
  }

  sendAjax('POST', $("#stopForm").attr("action"), $("#stopForm").serialize(), function () {
    loadStopsFromServer();
  });
  return false;
};

var handleDeleteClick = function handleDeleteClick(stop) {
  var stopId = stop._id;

  var _csrf = document.querySelector("#tokenInput");

  var deleteData = "_csrf=".concat(_csrf.value, "&stopId=").concat(stopId);
  sendAjax('DELETE', '/delete-stop', deleteData, loadStopsFromServer);
};

var handlePassChange = function handlePassChange(e) {
  e.preventDefault();
  $("#stopMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("STOP! All fields are required");
    return false;
  }

  if ($("#pass").val() === $("#pass2").val()) {
    handleError("STOP! Passwords should not match");
    return false;
  }

  sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);
  return false;
};

var StopForm = function StopForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "stopForm",
    onSubmit: handleStop,
    name: "stopForm",
    action: "/stops",
    method: "POST",
    className: "stopForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "stopName",
    type: "text",
    name: "name",
    placeholder: "Stop Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "address"
  }, "Address: "), /*#__PURE__*/React.createElement("input", {
    id: "stopAddress",
    type: "text",
    name: "address",
    placeholder: "Stop Address"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "dispatch"
  }, "Dispatch: "), /*#__PURE__*/React.createElement("input", {
    id: "stopDispatch",
    type: "text",
    name: "dispatch",
    placeholder: "Stop Dispatch"
  }), /*#__PURE__*/React.createElement("input", {
    id: "tokenInput",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeStopSubmit",
    type: "submit",
    value: "Make Stop"
  }));
};

var StopList = function StopList(props) {
  if (props.stops.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "stopList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyStop"
    }, "No Stops yet"));
  }

  var stopNodes = props.stops.map(function (stop) {
    return /*#__PURE__*/React.createElement("div", {
      key: stop._id,
      className: "stop",
      onClick: function onClick() {
        return handleDeleteClick(stop);
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/stopface.jpeg",
      alt: "stop face",
      className: "stopFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "stopName"
    }, " Name: ", stop.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "stopAddress"
    }, " Address: ", stop.address, " "), /*#__PURE__*/React.createElement("h3", {
      className: "stopDispatch"
    }, " Dispatch: ", stop.dispatch, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "stopList"
  }, stopNodes);
};

var AccountList = function AccountList(props) {
  var accountNodes = props.accounts.map(function (account) {
    return /*#__PURE__*/React.createElement("div", {
      key: account.username,
      className: "account"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/stopface.jpeg",
      alt: "stop face",
      className: "stopFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "accountName"
    }, " Username: ", account.username, " "), /*#__PURE__*/React.createElement("h3", {
      className: "stopAddress"
    }, " Created Date: ", account.createdDate, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "accounts"
  }, accountNodes);
};

var loadStopsFromServer = function loadStopsFromServer() {
  sendAjax('GET', '/getStops', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(StopList, {
      stops: data.stops
    }), document.querySelector("#stops"));
  });
};

var AccountWindow = function AccountWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "accountForm",
    name: "accountForm",
    onSubmit: handlePassChange,
    action: "/passChange",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    clasName: "passwordLabel",
    htmlFor: "pass"
  }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("label", {
    className: "passwordLabel",
    htmlFor: "pass2"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }));
};

var createAccountWindow = function createAccountWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createAdminWindow = function createAdminWindow(csrf) {
  sendAjax('GET', '/getAccounts', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AccountList, {
      accounts: data.account
    }), document.querySelector("#content"));
  });
};

var setup = function setup(csrf) {
  var accountButton = document.querySelector("#accountButton");
  var adminButton = document.querySelector("#adminButton");
  accountButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAccountWindow(csrf);
    return false;
  });
  adminButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAdminWindow(csrf);
    return false;
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(StopForm, {
    csrf: csrf
  }), document.querySelector("#makeStop"));
  ReactDOM.render( /*#__PURE__*/React.createElement(StopList, {
    stops: []
  }), document.querySelector("#stops"));
  loadStopsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#stopMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("stopMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
