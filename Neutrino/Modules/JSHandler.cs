using Neutrino.Modules;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Data.Json;

namespace Neutrino
{
    class JSHandler
    {
        private Dictionary<string, NeutrinoModule> map;

        public JSHandler()
        {

            this.map = new Dictionary<string, NeutrinoModule>();
            map.Add("FileSystem", new FileSystem());
        }

        public void handle(JsonObject json)
        {
            var type = json["type"].ToString().Split('_');
            Debug.WriteLine(type[2]);
        }
    }
}
