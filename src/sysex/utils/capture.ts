import { decodeMonologueParameters } from "../decode";
import * as fs from "node:fs";
import * as easymidi from "easymidi";

const storePatch = (data: any, path: string) => {
  try {
    console.log(`saving ${path}`);
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const storeData = (data: any, path: string) => {
  try {
    console.log(`saving ${path}`);
    console.log(data);
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const input = new easymidi.Input("monologue KBD/KNOB");
input.on("sysex", function (msg: easymidi.Sysex) {
  const patch = decodeMonologueParameters(msg.bytes as any);
  const patchName = patch.patchName.split("\x00")[0];
  storeData(msg.bytes, `./src/sysex/tests/data/motion-steps-demo/${patchName}-raw-sysex`);
  //   storeData(patch, `./sysex/tests/data/motion-steps-demo/${patchName}-data`);
  storePatch(patch, `./src/sysex/tests/data/motion-steps-demo/${patchName}.json`);
});
