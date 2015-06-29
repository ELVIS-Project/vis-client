import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_Project from '../../../../../Models/VISRC_Project';
import VISRC_ViewWorkflowRunListItem from './VISRC_ViewWorkflowRunListItem';

/**
 * This class represents the view (and controller) for a project
 */
class VISRC_ViewProject extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
        this.ui = {
            resourceCount: '#resource_count',
            workflowCount: '#workflow_count'
        }
        this.events = {
            'click @ui.resourceCount': '_handleClickResourceCount',
            'click @ui.workflowCount': '_handleClickWorkflowCount'
        };
        this.template = "#template-main_project_individual";
        this.childView = VISRC_ViewWorkflowRunListItem;
        this.childViewContainer = 'tbody';
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_WORKFLOWRUN);
    }

    /**
     * Returns the associated WorkflowRun collection to the template.
     */
    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aReturn)
    {
        this.model = aReturn.project;
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_WORKFLOWRUNS, {project: this.model.id});
    }

    /**
     * TODO docs
     */
    _handleClickResourceCount()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__RESOURCES_SELECTED);
    }

    /**
     * TODO docs
     */
    _handleClickWorkflowCount()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWS_SELECTED);
    }
}

export default VISRC_ViewProject;