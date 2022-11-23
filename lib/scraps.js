// Scraps file. Not expected to work.
/* eslint-disable */

import nunjucks from "nunjucks";
import * as util from "util";

const layouts_dumpcontext = {
  extensions: {
    dumpcontext: new (class dumpcontext {
      constructor() {
        console.log("got here 1");
        this.tags = ["dumpcontext"];
      }
      parse(parser, nodes, lexer) {
        // no arguments
        console.log("got here 2");
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, "run");
      }
      run(context, url) {
        console.log("got here 3");
        return nunjucks.runtime.markSafe(
          `<pre>${nunjucks.lib.escape(util.inspect(context))}</pre>`
        );
      }
    })(),
  },
};
