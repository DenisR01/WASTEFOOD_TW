
import food from "../media/food.svg";
function Aliment(props) {
  return (
    <div
      className="card col-xs-12 col-sm-4 col-lg-4">
      <img className="card-img-top" src={food} alt="Card image cap"></img>
      <div className="card-body">
        <h5 className="card-title">{props.aliment.category} - {props.aliment.name} - {props.aliment.date.substring(0, 10)}
          {props.aliment.creatorUser ? ' - ' + props.aliment.creatorUser.firstName + ' ' + props.aliment.creatorUser.lastName : ''}</h5>
        {props.aliment.creatorUser&&props.aliment.creatorUser.userName != props.user.userName ?
          <button onClick={()=>props.claimFunction(props.aliment.id)} className="btn btn-success">Claim</button>
          : ''}
        <div class="form-check">
          <input type="checkbox" checked={props.aliment.available} onChange={()=>props.onChange(props.aliment.id)} disabled={props.aliment.creatorUser &&props.aliment.creatorUser.userName != props.user.userName} class="form-check-input" id="Available" />
          <label class="form-check-label" htmlFor="Available">Available</label>
        </div>
      </div>
    </div>
  );
}
export default Aliment;
