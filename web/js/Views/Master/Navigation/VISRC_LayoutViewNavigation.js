import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import NavTestView from './NavTestView'

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class VISRC_LayoutViewNavigation extends Marionette.LayoutView
{
    /**
     * TODO docs
     */
    initialize(aOptions)
    {
        this.el = "#app";
        this.template = "#template-empty";
        this.addRegions({
            regionNavigation: "#region-navigation"
        });
        this.testView = new NavTestView();
    }

    /**
     * TODO docs
     */
    onRender()
    {
        this.regionNavigation.show(this.testView);
    }
}

export default VISRC_LayoutViewNavigation;