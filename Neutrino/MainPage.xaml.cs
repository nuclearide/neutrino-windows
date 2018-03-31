using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using Windows.ApplicationModel;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Foundation.Metadata;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using System.Runtime.Serialization;
using Windows.Data.Json;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409


namespace Neutrino
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>


    public sealed partial class MainPage : Page
    {

        private JSHandler jshandler = new JSHandler();

        public MainPage()
        {
            this.InitializeComponent();
            MainWebView.ScriptNotify += MainWebView_ScriptNotify;
            clearAndLoad();
        }

        public async void clearAndLoad()
        {
            await WebView.ClearTemporaryWebDataAsync();
            MainWebView.Navigate(new Uri("ms-appx-web:///Assets/App/dist/index.html"));
        }

        private async void MainWebView_ScriptNotify(object sender, NotifyEventArgs e)
        {
            JsonObject json = JsonValue.Parse(e.Value).GetObject();
            jshandler.handle(json);
        }

        private void MainWebView_RightTapped(object sender, RightTappedRoutedEventArgs e)
        {
            MenuFlyout myFlyout = new MenuFlyout();
            MenuFlyoutItem firstItem = new MenuFlyoutItem { Text = "Reload" };
            myFlyout.Items.Add(firstItem);
            firstItem.Click += Refresh;
            FrameworkElement senderElement = sender as FrameworkElement;
            myFlyout.ShowAt(senderElement, e.GetPosition(senderElement));
        }

        private async void Refresh(object sender, RoutedEventArgs e)
        {
            await WebView.ClearTemporaryWebDataAsync();
            MainWebView.Refresh();
        }
    }
}
