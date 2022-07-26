import React from 'react';

import { Context } from '../../context';
import { LogContainer } from '../LogContainer';

function statifyContent(subscriptContent, outerOnSubmitHandler, default_state = {}) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = Object.assign({}, default_state);

    }

    componentDidMount() {
      const saved_jobs = (JSON.parse(localStorage.getItem('jobs')) || []).filter(({ type }) => type === this.props.job_type);

      if (saved_jobs.length){
        const merged_jobs = this.state.triggered_jobs || [];

        saved_jobs.forEach((saved_job) => {
          if (!merged_jobs.map(({ id }) => id).includes(saved_job.id)) {
            merged_jobs.push(saved_job);
          }
        });

        if (merged_jobs !== this.state.triggered_jobs) {
          this.setState(() => ({ triggered_jobs: merged_jobs }));
        }
      }

    }

    onSubmitHandler = async (e) => {
      e.preventDefault();

      const job = await outerOnSubmitHandler.bind(this)(this.state);

      if (job) {
        let triggered_jobs = this.state.triggered_jobs || [];

        triggered_jobs.push(job);

        const saved_jobs = JSON.parse(localStorage.getItem('jobs')) || [];

        saved_jobs.push(job);
        localStorage.setItem('jobs', JSON.stringify(saved_jobs));

        this.setState(() => ({ triggered_jobs }));

      }
    };

    removeJobFunc = (job_id) => {
      const jobs = this.state.triggered_jobs.filter((job) => job.id !== job_id);
      const saved_jobs = (JSON.parse(localStorage.getItem('jobs')) || []).filter(({ id }) => id !== job_id);

      localStorage.setItem('jobs', JSON.stringify(saved_jobs));
      this.setState(() => ({ triggered_jobs: jobs }));
    };

    render() {
      return <Context.Consumer>{(context) => {

        // TODO: What if pass only `this`??? UPD: or bind!
        return <React.Fragment>
          { subscriptContent(this.state, this.setState.bind(this), context, this.onSubmitHandler) }
          { this.state.is_logs_on && <LogContainer jobs={this.state.triggered_jobs} onRemoveJob={this.removeJobFunc.bind(this)} />}
        </React.Fragment>;
      } }</Context.Consumer>;
    }
  }
}

export default statifyContent;