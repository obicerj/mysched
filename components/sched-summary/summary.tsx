export function Summary({ ...props }) {
    return (
        <div className="mt-8">
            <p className="text-xl text-slate-700 font-semibold">
                Hello {props.name},
            </p>
            <h1 className="text-4xl font-bold">
                <span>You have</span>
                {/* total schedule */}
                <span className="text-amber-500">
                    &nbsp;{props.totalSchedToday}&nbsp;
                </span>
                <span className="text-amber-500">schedule</span>
                <br />
                {props.totalSchedToday ? (
                    <span>waiting for you today.</span>
                ) : (
                    <span>have a wonderful day.</span>
                )}
            </h1>
        </div>
    );
}
