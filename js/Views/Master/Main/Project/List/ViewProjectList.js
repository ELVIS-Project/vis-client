import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewProjectListItem from './ViewProjectListItem';

/**
 * Project list view.
 */
class ViewProjectList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize()
    {
        this._initializeRadio();
        var user = this.rodanChannel.request(Events.REQUEST__USER);
        this.collection = this.rodanChannel.request(Events.REQUEST__PROJECT_COLLECTION);
        this.rodanChannel.request(Events.COMMAND__PROJECTS_LOAD, {query: {user: user.get('uuid')}});
        this.rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__PROJECTS_SYNC, 
                                                                      options: {}, 
                                                                      callback: null});
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

    /**
     * Handle button new project.
     */
    _handleButtonNewProject()
    {
        var user = this.rodanChannel.request(Events.REQUEST__USER);
        this.rodanChannel.request(Events.COMMAND__PROJECT_ADD, {user: user});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewProjectList.prototype.modelEvents = {
    'all': 'render'
};
ViewProjectList.prototype.ui = {
    buttonNewProject: '#button-new_project'
};
ViewProjectList.prototype.events = {
    'click @ui.buttonNewProject': '_handleButtonNewProject'
};
ViewProjectList.prototype.childViewContainer = 'tbody';
ViewProjectList.prototype.template = '#template-main_project_list';
ViewProjectList.prototype.childView = ViewProjectListItem;
ViewProjectList.prototype.behaviors = {Table: {'table': '#table-projects'}};

export default ViewProjectList;