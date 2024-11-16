export function Summary({ ...props }) {
    return (
        <div className="mt-8">
            <p className="text-xl text-slate-700 font-semibold">
                Hello {props.name},
            </p>
            <h1 className="text-4xl font-bold">
                <span>You have</span>
                {/* num of event */}
                <span className="text-amber-500">
                    &nbsp;{props.totalSchedToday}&nbsp;
                </span>
                {/* event label */}
                <span className="text-amber-500">schedule</span>
                <br />
                <span>waiting for you today.</span>
            </h1>
            {/* if none
        Have a good day, {name} wave
        */}
        </div>
    );
}
