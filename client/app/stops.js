
const handleStop = (e) => {
    e.preventDefault ();

    $("#stopMessage").animate({width:'hide'},350);

    if($("#stopName").val() == '' || $("#stopAddress").val()== '' || $("#stopDispatch").val()== '') {
        handleError("STOP! All fields are required");
        return false;
    }

    sendAjax('POST', $("#stopForm").attr("action"), $("#stopForm").serialize(), function(){
        loadStopsFromServer();
    });

    return false;
};

const handleDeleteClick = (stop) => {
    const stopId = stop._id
    const _csrf = document.querySelector("#tokenInput");
    const deleteData = `_csrf=${_csrf.value}&stopId=${stopId}`;
    sendAjax('DELETE', '/delete-stop', deleteData, loadStopsFromServer);
} 

const handlePassChange = (e) => {
    e.preventDefault();

    $("#stopMessage").animate({width:'hide'},350);

    if($("#pass").val()==''|| $("#pass2").val()==''){
        handleError("STOP! All fields are required");
        return false;
    }

    if($("#pass").val() === $("#pass2").val()){
        handleError("STOP! Passwords should not match");
        return false;
    }

    sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);

    return false;
};

const StopForm = (props) => {
    return(
        <form id="stopForm" 
        onSubmit={handleStop}
        name="stopForm"
        action="/stops"
        method="POST"
        className="stopForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="stopName" type="text" name="name" placeholder="Stop Name"/>
            <label htmlFor="address">Address: </label>
            <input id="stopAddress" type="text" name="address" placeholder="Stop Address"/>
            <label htmlFor="dispatch">Dispatch: </label>
            <input id="stopDispatch" type="text" name="dispatch" placeholder="Stop Dispatch"/>
            <input id="tokenInput" type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeStopSubmit" type="submit" value="Make Stop"/>
            
        </form>
    )
};

const StopList = function(props) {
    if(props.stops.length === 0){
        return(
            <div className="stopList">
                <h3 className="emptyStop">No Stops yet</h3>
            </div>
        )
    }

    const stopNodes = props.stops.map(function(stop) {
        return (
            <div key={stop._id} 
            className="stop"
            onClick={()=>handleDeleteClick(stop)}
            >
                <img src="/assets/img/stopface.jpeg" alt="stop face" className="stopFace"/>
                <h3 className="stopName"> Name: {stop.name} </h3>
                <h3 className="stopAddress"> Address: {stop.address} </h3>
                <h3 className="stopDispatch"> Dispatch: {stop.dispatch} </h3>
            </div>
        )
    })

    return (
        <div className="stopList">
            {stopNodes}
        </div>
    )
}

const AccountList = function(props) {

    const accountNodes = props.accounts.map(function(account) {
        return (
            <div key={account.username} 
            className="account"
            >
                <img src="/assets/img/stopface.jpeg" alt="stop face" className="stopFace"/>
                <h3 className="accountName"> Username: {account.username} </h3>
                <h3 className="stopAddress"> Created Date: {account.createdDate} </h3>
            </div>
        )
    })

    return (
        <div className="accounts">
            {accountNodes}
        </div>
    )
}

const loadStopsFromServer =()=>{
    sendAjax('GET', '/getStops',null,(data)=>{
        ReactDOM.render(
            <StopList stops={data.stops} />, document.querySelector("#stops")
        )
    })
}

const AccountWindow = (props) => {
    return(
        <form id="accountForm" name="accountForm"
        onSubmit={handlePassChange}
        action="/passChange"
        method="POST"
        className="mainForm"
        >
            <label clasName="passwordLabel" htmlFor="pass">Old Password: </label>
            <input id="pass" type="password" name="pass" placeholder="old password"/>
            <label className="passwordLabel" htmlFor="pass2">New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="new password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Change Password"/>

        </form>
    )
}

const createAccountWindow = (csrf) => {
    ReactDOM.render(
        <AccountWindow csrf={csrf} />,
        document.querySelector("#content")
    )
}

const createAdminWindow = (csrf) => {
    sendAjax('GET', '/getAccounts',null,(data)=>{
        ReactDOM.render(
            <AccountList accounts={data.account} />, document.querySelector("#content")
        )
    })
}

const setup = function(csrf){
    const accountButton = document.querySelector("#accountButton");
    const adminButton = document.querySelector("#adminButton");

    accountButton.addEventListener("click",(e)=>{
        e.preventDefault();
        createAccountWindow(csrf);
        return false;
    });

    adminButton.addEventListener("click",(e)=>{
        e.preventDefault();
        createAdminWindow(csrf);
        return false;
    });

    ReactDOM.render(
        <StopForm csrf={csrf}/>,document.querySelector("#makeStop")
    );

    ReactDOM.render(
        <StopList stops={[]}/>,document.querySelector("#stops")
    )



    loadStopsFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    })
}

$(document).ready(function() {
    getToken();
});