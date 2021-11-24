
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

const StopForm = (props) => {
    return(
        <form id="stopForm" 
        onSubmit={handleStop}
        name="stopForm"
        action="/maker"
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

const loadStopsFromServer =()=>{
    sendAjax('GET', '/getStops',null,(data)=>{
        ReactDOM.render(
            <StopList stops={data.stops} />, document.querySelector("#stops")
        )
    })
}

const setup = function(csrf){
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