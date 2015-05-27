import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_Score from './VISRC_Score'

class VISRC_ScoreCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = VISRC_Score;
        this._initializeRadio();
    }

    /**
     * TODO docs
     */
    parse(resp, options)
    {
        return resp.results;
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
        this.rodanChannel.on(VISRC_Events.EVENT__APPLICATION_READY, () => this._handleEventApplicationReady());
        this.rodanChannel.on(VISRC_Events.EVENT__SCORES_SELECTED, aProjectid => this._handleEventScoresSelected(aProjectid));
    }

    /**
     * Retrieves list of scores for the Project.
     */
    _retrieveScoreList(aQueryParameters)
    {
        this.fetch({ data: $.param(aQueryParameters) });
    }

    /**
     * Handles application ready notification.
     */
    _handleEventApplicationReady()
    {
        var appInstance = this.rodanChannel.request(VISRC_Events.REQUEST__APPLICATION);
        this.url = appInstance.controllerServer.routeForRouteName('resources');
    }

    /**
     * Handle project scores selection.
     */
    _handleEventScoresSelected(aQueryParameters)
    {
        this._retrieveScoreList(aQueryParameters);
    }
}

export default VISRC_ScoreCollection;