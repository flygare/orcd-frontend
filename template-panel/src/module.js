import {PanelCtrl} from 'app/features/panel/panel_ctrl';
import moment from 'moment';

var object = {};
var pane = [];
class TestPanelCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    this.object = {
      msg: "Default Message"
    };
    this.time = moment().seconds(0).milliseconds(0).add(1, 'day').toDate();

    this.pane = ["comp", "tel"];
  }
}

TestPanelCtrl.templateUrl ='module.html';

export {
  TestPanelCtrl as PanelCtrl
};
