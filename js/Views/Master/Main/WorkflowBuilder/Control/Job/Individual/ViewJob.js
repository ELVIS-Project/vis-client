import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the view for a single Job.
 */
class ViewJob extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this._initializeRadio();
        this.model = aParameters.job;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewJob.prototype.modelEvents = {
    'all': 'render'
};
ViewJob.prototype.template = '#template-main_workflowbuilder_control_job_individual';

export default ViewJob;