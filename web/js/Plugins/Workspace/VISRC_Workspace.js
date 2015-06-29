import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../Shared/VISRC_Events';
import VISRC_ConnectionItem from './Items/VISRC_ConnectionItem';
import VISRC_InputPortItem from './Items/VISRC_InputPortItem';
import VISRC_OutputPortItem from './Items/VISRC_OutputPortItem';
import VISRC_WorkflowJobItem from './Items/VISRC_WorkflowJobItem';

/**
 * Main Workspace class.
 */
class VISRC_Workspace
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize the workspace.
     * The element associated with the canvas ID MUST be available at this time.
     */
    initialize(aCanvasElementId)
    {
        this._STATES = {
            IDLE: 0,
            BUSY: 1,
            GRABBED_WORKFLOWJOBITEM: 2,
            CREATING_CONNECTION: 3
        };
        this._state = this._STATES.IDLE;
        this._selectedOutputPortItem = null;

        paper.setup(aCanvasElementId);
        paper.handleMouseEvent = aData => this._handleMouseEvent(aData);

        this._initializeRadio();

        // TODO - magic numbers
        var canvasWidth = paper.view.viewSize.width;
        var canvasHeight = paper.view.viewSize.height;
        var workflowJobItemWidth = canvasWidth * 0.2;
        var workflowJobItemHeight = canvasHeight * 0.1;
        var inputPortItemWidth = workflowJobItemHeight * 0.2;
        var inputPortItemHeight = workflowJobItemWidth * 0.1;
        this._segments = {
            workflowJobItem: [
                new paper.Point(0, 0), 
                new paper.Point(workflowJobItemWidth, 0), 
                new paper.Point(workflowJobItemWidth, workflowJobItemHeight), 
                new paper.Point(0, workflowJobItemHeight), 
                new paper.Point(0, 0)
            ],
            portItem: [
                new paper.Point(0, 0), 
                new paper.Point(inputPortItemWidth, 0), 
                new paper.Point(inputPortItemWidth, inputPortItemHeight), 
                new paper.Point(0, inputPortItemHeight), 
                new paper.Point(0, 0)
            ],
            connection: [new paper.Point(0, 0), new paper.Point(1, 0)]
        };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle mouse event.
     */
    _handleMouseEvent(aData)
    {
        switch (this._state)
        {
            case this._STATES.IDLE:
            {
                this._handleStateIdle(aData);
                break;
            }

            case this._STATES.BUSY:
            {
                this._handleStateBusy(aData);
                break;
            }

            case this._STATES.GRABBED_WORKFLOWJOBITEM:
            {
                this._handleStateGrabbedWorkflowJobItem(aData);
                break;
            }

            case this._STATES.CREATING_CONNECTION:
            {
                this._handleStateCreatingConnection(aData);
                break;
            }

            default:
            {
                console.log("TODO - ERROR");
                break;
            }
        }
    }

    /**
     * Handle idle state.
     */
    _handleStateIdle(aData)
    {
        if (aData.event.type == "mousedown" && aData.item instanceof VISRC_WorkflowJobItem)
        {
            this._state = this._STATES.GRABBED_WORKFLOWJOBITEM;
        }
        else if (aData.event.type == "click")
        {
            if (aData.item instanceof VISRC_OutputPortItem)
            {
                this._selectedOutputPortItem = aData.item;
                this._state = this._STATES.CREATING_CONNECTION; 
            }
        }
    }

    /**
     * Handle busy state.
     */
    _handleStateBusy(aData)
    {
        
    }

    /**
     * Handle grabbed workflowjobitem state.
     */
    _handleStateGrabbedWorkflowJobItem(aData)
    {
        if (aData.item instanceof VISRC_WorkflowJobItem)
        {
            if (aData.event.type == "mousemove")
            {
                aData.item.move(aData.event.delta);
            }
            else if (aData.event.type == "mouseup")
            {
                this._state = this._STATES.IDLE;
            }
        }
    }

    /**
     * Handle creating connection state.
     */
    _handleStateCreatingConnection(aData)
    {
        if (aData.event.type == "click")
        {
            if (aData.item instanceof VISRC_InputPortItem)
            {
                this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_CONNECTION, {inputport: aData.item._associatedModel, 
                                                                                                 outputport: this._selectedOutputPortItem._associatedModel});
                this._selectedOutputPortItem = null;
                this._state = this._STATES.IDLE;
            }
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJobItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_CONNECTION, aReturn => this._handleCommandAddConnection(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_INPUTPORT, aReturn => this._handleCommandAddInputPortItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_OUTPUTPORT, aReturn => this._handleCommandAddOutputPortItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_DELETE_ITEM_INPUTPORT, aReturn => this._handleCommandDeleteInputPortItem(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKSPACE_DELETE_ITEM_OUTPUTPORT, aReturn => this._handleCommandDeleteOutputPortItem(aReturn));
    }

    /**
     * Handle add.
     */
    _handleCommandAddWorkflowJobItem(aReturn)
    {
        this._createWorkflowJobItem(aReturn.workflowjob);
        paper.view.draw();
    }

    /**
     * Handle add input port item.
     */
    _handleCommandAddInputPortItem(aReturn)
    {
        this._createInputPortItem(aReturn.workflowjob, aReturn.inputport);
        aReturn.workflowjob.paperItem.update();
        paper.view.draw();
    }

    /**
     * Handle add output port item.
     */
    _handleCommandAddOutputPortItem(aReturn)
    {
        this._createOutputPortItem(aReturn.workflowjob, aReturn.outputport);
        aReturn.workflowjob.paperItem.update();
        paper.view.draw();
    }

    /**
     * Handle delete input port item.
     */
    _handleCommandDeleteInputPortItem(aReturn)
    {
        aReturn.workflowjob.paperItem.deleteInputPortItem(aReturn.inputport.paperItem);
        aReturn.inputport.paperItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle delete output port item.
     */
    _handleCommandDeleteOutputPortItem(aReturn)
    {
        aReturn.workflowjob.paperItem.deleteOutputPortItem(aReturn.outputport.paperItem);
        aReturn.outputport.paperItem.destroy();
        paper.view.draw();
    }

    /**
     * Handle connection add.
     */
    _handleCommandAddConnection(aReturn)
    {
        this._createConnectionItem(aReturn.connection, aReturn.inputport, aReturn.outputport);
    }

    /**
     * Creates a workflow job item.
     */
    _createWorkflowJobItem(aModel)
    {
        aModel.paperItem = new VISRC_WorkflowJobItem({segments: this._segments.workflowJobItem, model: aModel});
    }

    /**
     * Creates an input port item for the associated workflow job.
     */
    _createInputPortItem(aWorkflowJob, aModel)
    {
        aModel.paperItem = new VISRC_InputPortItem({segments: this._segments.portItem, model: aModel});
        aWorkflowJob.paperItem.addInputPortItem(aModel.paperItem);
    }

    /**
     * Creates an output port item for the associated workflow job.
     */
    _createOutputPortItem(aWorkflowJob, aModel)
    {
        aModel.paperItem = new VISRC_OutputPortItem({segments: this._segments.portItem, model: aModel});
        aWorkflowJob.paperItem.addOutputPortItem(aModel.paperItem);
    }

    /**
     * Creates a connection.
     */
    _createConnectionItem(aModel, aInputPort, aOutputPort)
    {
        aModel.paperItem = new VISRC_ConnectionItem({segments: this._segments.connection,
                                                     model: aModel, 
                                                     inputPort: aInputPort, 
                                                     outputPort: aOutputPort});

        // Associate the ports with the connection.
        aInputPort.paperItem.setConnectionItem(aModel.paperItem);
        aOutputPort.paperItem.addConnectionItem(aModel.paperItem);
    }
}

export default VISRC_Workspace;