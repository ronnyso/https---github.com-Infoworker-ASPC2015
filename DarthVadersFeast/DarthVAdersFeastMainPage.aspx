<%@ Page language="C#"   Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceholderID="PlaceHolderAdditionalPageHead" runat="server">
	<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	<PublishingWebControls:EditModePanel runat="server">
		<!-- Styles for edit mode only-->
		<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"
			After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	</PublishingWebControls:EditModePanel>
	<SharePointWebControls:FieldValue id="PageStylesField" FieldName="HeaderStyleDefinitions" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:FieldValue id="PageTitle" FieldName="Title" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderPageTitleInTitleArea" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderTitleBreadcrumb" runat="server"> <SharePointWebControls:ListSiteMapPath runat="server" SiteMapProviders="CurrentNavigationSwitchableProvider" RenderCurrentNodeAsLink="false" PathSeparator="" CssClass="s4-breadcrumb" NodeStyle-CssClass="s4-breadcrumbNode" CurrentNodeStyle-CssClass="s4-breadcrumbCurrentNode" RootNodeStyle-CssClass="s4-breadcrumbRootNode" NodeImageOffsetX=0 NodeImageOffsetY=289 NodeImageWidth=16 NodeImageHeight=16 NodeImageUrl="/_layouts/15/images/fgimg.png?rev=38" HideInteriorRootNodes="true" SkipLinkText="" /> </asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderMain" runat="server">
                    <script type="text/javascript">
                        loadCSS = function (href) {
                            var cssLink = $("<link rel='stylesheet' type='text/css' href='" + href + "'>");
                            $("head").append(cssLink);
                        };
                        loadCSS("/_catalogs/masterpage/DartVadersFeast/menu.css");
                        $(document).ready(function () {
                            //$('[data-toggle="tooltip"]').tooltip()
                        });
                    </script>
                    <div class="row">
                        <div class="col-md-8 col-xs-12">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4>Menu
                                            </h4>
                                        </div>
                                        <div class="panel-body" id="DishesOverview">
                                            <div id="Dishes"  data-bind="foreach: dishes" >
                                                <div title="Description" data-toggle="tooltip" data-placement="top">
                                                    <img data-bind="click: $parent.dishClicked,attr: { src: picture }">
                                                    <div>
                                                        <label data-bind="text: title"></label>
                                                        <span class="glyphicon glyphicon-thumbs-up" data-bind="click: $parent.dishLiked" title="Like"></span>
                                                    </div>
                                                    <div>Price: <span data-bind="text: price"></span>$</div>
                                                    <div data-bind="text: description">null</div>
                                                    <span data-bind="text: count" class="badge"></span>
                                                    <span data-bind="click: $parent.addDishToOrder" class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                                    <span data-bind="click: $parent.removeDishFromOrder"class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                                                </div>
                                            </div>
                                            <WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_Header%>" ID="WebPartZone2"/>
                                        </div>
                                        <div class="panel-body" id="OrderReply" style="display:none;">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12" style="diplay:none;">
                                    <div class="panel panel-default panel-dark">
                                        <div class="panel-body star-wars-text" style="height: 500px; overflow: hidden;background-color: #000;position:relative;" id="PlacedOrder">
                                             Some content
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-xs-12">
                            <div class="row">
                                <div class="col-md-12 col-xs-12">
                                    <div class="panel panel-default clearfix">
                                        <div class="panel-heading">
                                            <h5>Order Summary</h5>
                                        </div>
                                        <div class="panel-body order-summary">
                                            <table style="width: 100%;" data-bind="if: totalPrice() > 0">
                                                <thead>
                                                    <tr>
                                                        <td>Dish name</td>
                                                        <td>Count</td>
                                                    </tr>
                                                </thead>
                                            <tbody  data-bind="foreach: dishes" >
                                                <tr data-bind="if: count() > 0">
                                                    <td data-bind="text: title"></td>
                                                    <td data-bind="text: count"></td>
                                                </tr>
                                            </tbody>
                                                <tfoot>
                                                    <td>Total price</td>
                                                    <td data-bind="text: totalPrice() + '$'"></td>
                                                </tfoot>
                                            </table>
                                            <div data-bind="if: totalPrice() > 0">
                                                <label>Delivery adresse:</label><br />
                                                <input style="width: 100%" data-bind="value: orderAdresse" />
                                            </div>
                                            <div data-bind="if: totalPrice() > 0">
                                            <button class="btn-success" style="float: right;" data-bind="click: placeOrder">Order</button>
                                            </div>
                                            <span data-bind="if: totalPrice() < 1">No dishes selected</span>
                        					<WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_Header%>" ID="WebPartZone3"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 col-xs-12">
                                    <div class="panel panel-default clearfix">
                                        <div class="panel-heading">
                                            <h5>Most liked dishes</h5>
                                        </div>
                                        <div class="panel-body most-liked">
                                                   <div id="MostLikedCanvas"></div>
                                                                                        <div id="DishLabels"  data-bind="foreach: dishes" >
                                                <div class="canvas-label">
                                                    <label data-bind="text: title"></label>
                                                    <span class="dish-color" data-bind="style: {'background-color': color}"></span>
                                                </div>
                                            </div>

                					<WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_Header%>" ID="WebPartZone1"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 col-xs-12" style="display:none;">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                Chat
                            
                                        </div>
                                        <div class="panel-body" style="height: auto;">
                                Signalr real time chat client                            
                                            					<WebPartPages:WebPartZone runat="server" Title="<%$Resources:cms,WebPartZoneTitle_Header%>" ID="Header"/>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                    <%--Hidden tekst that is showed when order is received--%>
                                    <div class="panel-dark"  id="OrderPlacedText" style="display:none;">
                                        <div class="panel-body star-wars-text" style="height: 500px; overflow: hidden;background-color: #000;position:relative;">
                                            <p id="start">Order received
                                            </p>
                                            <h1>Thank&nbsp;you&nbsp;for&nbsp;selecting Dart&nbsp;Vaders&nbsp;Feast
                                            </h1>
                                            <div id="titles">
                                                <div id="titlecontent">
                                                    <p>.
                                                    </p>
                                                    <p>
                                                        Dart Vader hope you har satisfied with your choices,
                                                    </p>
                                                    <p>
                                                        and wishes you a happy and peaceful meal.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        </div>




<%--	<div class="article article-right">
		<PublishingWebControls:EditModePanel runat="server" CssClass="edit-mode-panel title-edit">
			<SharePointWebControls:TextField runat="server" FieldName="Title"/>
		</PublishingWebControls:EditModePanel>
		<div class="captioned-image">
			<div class="image">
				<PublishingWebControls:RichImageField FieldName="PublishingPageImage" runat="server"/>
			</div>
			<div class="caption">
				<PublishingWebControls:RichHtmlField FieldName="PublishingImageCaption"  AllowTextMarkup="false" AllowTables="false" AllowLists="false" AllowHeadings="false" AllowStyles="false" AllowFontColorsMenu="false" AllowParagraphFormatting="false" AllowFonts="false" AllowInsert="false" AllowEmbedding="false" PreviewValueSize="Small" AllowDragDrop="false" runat="server"/>
			</div>
		</div>
		<div class="article-header">
			<div class="date-line">
				<SharePointWebControls:DateTimeField FieldName="ArticleStartDate" runat="server"/>
			</div>
			<div class="by-line">
				<SharePointWebControls:TextField FieldName="ArticleByLine" runat="server"/>
			</div>
		</div>
		<div class="article-content">
			<PublishingWebControls:RichHtmlField FieldName="PublishingPageContent" HasInitialFocus="True" MinimumEditHeight="400px" runat="server"/>
		</div>
		<PublishingWebControls:EditModePanel runat="server" CssClass="edit-mode-panel roll-up">
			<PublishingWebControls:RichImageField FieldName="PublishingRollupImage" AllowHyperLinks="false" runat="server" />
			<asp:Label text="<%$Resources:cms,Article_rollup_image_text15%>" CssClass="ms-textSmall" runat="server" />
		</PublishingWebControls:EditModePanel>
	</div>--%>
</asp:Content>
