import moduleRunner, { Events } from "../moduleRunner";
import "./chatbox";
import "./pishock";
import "./spotify";
import "./time";
import "./voicemeeter";
import "./window";

moduleRunner.emit(Events.initalizeParams);
moduleRunner.updateClientConfig();
