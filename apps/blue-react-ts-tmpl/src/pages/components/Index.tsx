import React from 'react';
import BrView from '$components/BrView';
import BrHeader from '$components/BrHeader';

function Index ( props: any ) {

	return (
		<BrView routes={props.routes}>
			<BrHeader centerControl={{
				title: `Components`
			}}/>
			<div>
				{(() => {
					const list = [];
					for (let i = 0; i < 30; i++) {
						list.push(
							<div className="ba-pd-20" key={i}>
								{i}
							</div>
						);
					}
					return list
				})()}
				<div className="ba-pd-14 ba-t-c">
					Components
				</div>
			</div>
		</BrView>
	);
}

export default Index;