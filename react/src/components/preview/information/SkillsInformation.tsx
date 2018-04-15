import React, {Component} from 'react'


type Props = {
    title: string;
    canExpand?: boolean;
    build: Build;
}

export class SkilsInformation extends Component<Props> {

    state = {
        expand: false
    };

    renderExpandControls() {
        const {canExpand} = this.props;
        if (!canExpand) return null;
        const {expand} = this.state;
        return <React.Fragement>
            {!expand && <a href="#" className="expand-list">Expand List</a>}
            {expand && <a href="#" className="reduce-list">Reduce List</a>}
        </React.Fragement>


    }

    render() {
        const {title, build} = this.props;

        return <div className="skills-informations skill-tab">
            <h2 className="title">{title}
                {this.renderExpandControls()}
            </h2>
            <div className="skill-list-wrapper">
                <ul className="skill-list">

                </ul>
            </div>
        </div>
    }
}