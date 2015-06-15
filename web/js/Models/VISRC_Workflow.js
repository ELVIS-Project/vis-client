import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_BaseModel from './VISRC_BaseModel';

/**
 * Represents a VIS Workflow model (i.e. a Rodan Workflow).
 */
class VISRC_Workflow extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    constructor(aParameters)
    {
        this.idAttribute = 'uuid';
        this.url = "http://132.206.14.136/workflows/";
        super(aParameters);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_Workflow;