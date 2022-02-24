module SendinblueDataPayloadHelpers
  include WebMock::API

  def webhook_payload(capability_url, message_id)
    {
      action: "rgpd_contact_error",
      capability_url_id: capability_url,
      controller: "sendinblue_webhooks",
      date: "2022-02-01 10:00:01",
      email: "mairie@ville.fr",
      event: "hard_bounce",
      id: 270000,
      "message-id": "<#{message_id}@smtp-relay.mailin.fr>",
      reason: "550 Requested action not taken: mailbox unavailable",
      sendinblue_webhook: {
        date: "2022-02-01 10:00:01",
        email: "mairie@ville.fr",
        event: "hard_bounce",
        id: 270000,
        "message-id": "<#{message_id}@smtp-relay.mailin.fr>",
        reason: "550 Requested action not taken: mailbox unavailable",
        sending_ip: "127.0.0.1",
        subject: "Vous avez été désigné délégué à la protection des données pour la démarche « Fiabilisation des tiers »",
        tag: "[\"rgpd-contact-email\"]",
        tags: [
          "rgpd-contact-email"
        ],
        template_id: 8,
        ts: 1643706001,
        ts_epoch: 1643706001000,
        ts_event: 1643706001
      },
      sending_ip: "127.0.0.1",
      subject: "Vous avez été désigné délégué à la protection des données pour la démarche « Fiabilisation des tiers »",
      tag: "[\"rgpd-contact-email\"]",
      tags: [
        "rgpd-contact-email"
      ],
      template_id: 8,
      ts: 1643706001,
      ts_epoch: 1643706001000,
      ts_event: 1643706001
    }
  end

  def stub_message_metadata_call(message_id, message_uuid)
    stub_request(
      :get,
      "https://api.sendinblue.com/v3/smtp/emails?messageId=%3C#{message_id}%40smtp-relay.mailin.fr%3E"
    ).to_return(
      status: 200,
      headers: {
        "Content-Type" => "application/json"
      },
      body: message_metadata_payload(message_id, message_uuid).to_json
    )
  end

  def message_metadata_payload(message_id, message_uuid)
    {
      count: 1,
      transactionalEmails: [
        {
          email: "mairie@ville.fr",
          subject: "Vous avez été désigné délégué à la protection des données pour la démarche « Fiabilisation des tiers »",
          messageId: "<#{message_id}@smtp-relay.mailin.fr>",
          uuid: message_uuid,
          date: "2022-02-01T10:00:00.000+01:00",
          templateId: 8,
          from: "contact@api.gouv.fr",
          tags: [
            "rgpd-contact-email"
          ]
        }
      ]
    }
  end

  def stub_email_content_call(message_uuid, demandeur_email, enrollment_id)
    stub_request(
      :get,
      "https://api.sendinblue.com/v3/smtp/emails/#{message_uuid}"
    ).to_return(
      status: 200,
      headers: {
        "Content-Type" => "application/json"
      },
      body: email_content_payload(
        "Jean JEAN",
        demandeur_email,
        "COMMUNE DE VILLE",
        "FranceConnect",
        "franceconnect",
        enrollment_id
      ).to_json
    )
  end

  def email_content_payload(
    prenom_nom,
    demandeur_email,
    nom_raison_sociale,
    target_api_label,
    target_api,
    enrollment_id
  )
    {
      email: "mairie@ville.fr",
      subject: "Vous avez été désigné délégué à la protection des données pour la démarche « Fiabilisation des tiers »",
      date: "2022-02-01T10:00:00.000+01:00",
      events: [
        {
          name: "sent",
          time: "2022-02-01T10:00:00.000+01:00"
        },
        {
          name: "hard_bounce",
          time: "2022-02-01T10:00:01.000+01:00"
        }
      ],
      body: "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\"><html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\"><head><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><meta name=\"x-apple-disable-message-reformatting\" /><meta name=\"apple-mobile-web-app-capable\" content=\"yes\" /><meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\" /><meta name=\"format-detection\" content=\"telephone=no\" /><title></title><link href=\"https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap\" rel=\"stylesheet\" type=\"text/css\" /><style type=\"text/css\">/* Resets */\n.ReadMsgBody { width: 100%; background-color: #ebebeb;}\n.ExternalClass {width: 100%; background-color: #ebebeb;}\n.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height:100%;}\na[x-apple-data-detectors]{\ncolor:inherit !important;\ntext-decoration:none !important;\nfont-size:inherit !important;\nfont-family:inherit !important;\nfont-weight:inherit !important;\nline-height:inherit !important;\n}\nbody {-webkit-text-size-adjust:none; -ms-text-size-adjust:none;}\nbody {margin:0; padding:0;}\n.yshortcuts a {border-bottom: none !important;}\n.rnb-del-min-width{ min-width: 0 !important; }\n/* Add new outlook css start */\n.templateContainer{\nmax-width:590px !important;\nwidth:auto !important;\n}\n/* Add new outlook css end */\n/* Image width by default for 3 columns */\nimg[class=\"rnb-col-3-img\"] {\nmax-width:170px;\n}\n/* Image width by default for 2 columns */\nimg[class=\"rnb-col-2-img\"] {\nmax-width:264px;\n}\n/* Image width by default for 2 columns aside small size */\nimg[class=\"rnb-col-2-img-side-xs\"] {\nmax-width:180px;\n}\n/* Image width by default for 2 columns aside big size */\nimg[class=\"rnb-col-2-img-side-xl\"] {\nmax-width:350px;\n}\n/* Image width by default for 1 column */\nimg[class=\"rnb-col-1-img\"] {\nmax-width:550px;\n}\n/* Image width by default for header */\nimg[class=\"rnb-header-img\"] {\nmax-width:590px;\n}\n/* Ckeditor line-height spacing */\n.rnb-force-col p, ul, ol{margin:0px!important;}\n.rnb-del-min-width p, ul, ol{margin:0px!important;}\n/* tmpl-2 preview */\n.rnb-tmpl-width{ width:100%!important;}\n/* tmpl-11 preview */\n.rnb-social-width{padding-right:15px!important;}\n/* tmpl-11 preview */\n.rnb-social-align{float:right!important;}\n/* Ul Li outlook extra spacing fix */\nli{mso-margin-top-alt: 0; mso-margin-bottom-alt: 0;}\n/* Outlook fix */\ntable {mso-table-lspace:0pt; mso-table-rspace:0pt;}\n/* Outlook fix */\ntable, tr, td {border-collapse: collapse;}\n/* Outlook fix */\np,a,li,blockquote {mso-line-height-rule:exactly;}\n/* Outlook fix */\n.msib-right-img { mso-padding-alt: 0 !important;}\n@media only screen and (min-width:590px){\n/* mac fix width */\n.templateContainer{width:590px !important;}\n}\n@media screen and (max-width: 360px){\n/* yahoo app fix width \"tmpl-2 tmpl-10 tmpl-13\" in android devices */\n.rnb-yahoo-width{ width:360px !important;}\n}\n@media screen and (max-width: 380px){\n/* fix width and font size \"tmpl-4 tmpl-6\" in mobile preview */\n.element-img-text{ font-size:24px !important;}\n.element-img-text2{ width:230px !important;}\n.content-img-text-tmpl-6{ font-size:24px !important;}\n.content-img-text2-tmpl-6{ width:220px !important;}\n}\n@media screen and (max-width: 480px) {\ntd[class=\"rnb-container-padding\"] {\npadding-left: 10px !important;\npadding-right: 10px !important;\n}\n/* force container nav to (horizontal) blocks */\ntd.rnb-force-nav {\ndisplay: inherit;\n}\n/* fix text alignment \"tmpl-11\" in mobile preview */\n.rnb-social-text-left {\nwidth: 100%;\ntext-align: center;\nmargin-bottom: 15px;\n}\n.rnb-social-text-right {\nwidth: 100%;\ntext-align: center;\n}\n}\n@media only screen and (max-width: 600px) {\n/* center the address &amp; social icons */\n.rnb-text-center {text-align:center !important;}\n/* force container columns to (horizontal) blocks */\nth.rnb-force-col {\ndisplay: block;\npadding-right: 0 !important;\npadding-left: 0 !important;\nwidth:100%;\n}\ntable.rnb-container {\nwidth: 100% !important;\n}\ntable.rnb-btn-col-content {\nwidth: 100% !important;\n}\ntable.rnb-col-3 {\n/* unset table align=\"left/right\" */\nfloat: none !important;\nwidth: 100% !important;\n/* change left/right padding and margins to top/bottom ones */\nmargin-bottom: 10px;\npadding-bottom: 10px;\n/*border-bottom: 1px solid #eee;*/\n}\ntable.rnb-last-col-3 {\n/* unset table align=\"left/right\" */\nfloat: none !important;\nwidth: 100% !important;\n}\ntable.rnb-col-2 {\n/* unset table align=\"left/right\" */\nfloat: none !important;\nwidth: 100% !important;\n/* change left/right padding and margins to top/bottom ones */\nmargin-bottom: 10px;\npadding-bottom: 10px;\n/*border-bottom: 1px solid #eee;*/\n}\ntable.rnb-col-2-noborder-onright {\n/* unset table align=\"left/right\" */\nfloat: none !important;\nwidth: 100% !important;\n/* change left/right padding and margins to top/bottom ones */\nmargin-bottom: 10px;\npadding-bottom: 10px;\n}\ntable.rnb-col-2-noborder-onleft {\n/* unset table align=\"left/right\" */\nfloat: none !important;\nwidth: 100% !important;\n/* change left/right padding and margins to top/bottom ones */\nmargin-top: 10px;\npadding-top: 10px;\n}\ntable.rnb-last-col-2 {\n/* unset table align=\"left/right\" */\nfloat: none !important;\nwidth: 100% !important;\n}\ntable.rnb-col-1 {\n/* unset table align=\"left/right\" */\nfloat: none !important;\nwidth: 100% !important;\n}\nimg.rnb-col-3-img {\n/**max-width:none !important;**/\nwidth:100% !important;\n}\nimg.rnb-col-2-img {\n/**max-width:none !important;**/\nwidth:100% !important;\n}\nimg.rnb-col-2-img-side-xs {\n/**max-width:none !important;**/\nwidth:100% !important;\n}\nimg.rnb-col-2-img-side-xl {\n/**max-width:none !important;**/\nwidth:100% !important;\n}\nimg.rnb-col-1-img {\n/**max-width:none !important;**/\nwidth:100% !important;\n}\nimg.rnb-header-img {\n/**max-width:none !important;**/\nwidth:100% !important;\nmargin:0 auto;\n}\nimg.rnb-logo-img {\n/**max-width:none !important;**/\nwidth:100% !important;\n}\ntd.rnb-mbl-float-none {\nfloat:inherit !important;\n}\n.img-block-center{text-align:center !important;}\n.logo-img-center\n{\nfloat:inherit !important;\n}\n/* tmpl-11 preview */\n.rnb-social-align{margin:0 auto !important; float:inherit !important;}\n/* tmpl-11 preview */\n.rnb-social-center{display:inline-block;}\n/* tmpl-11 preview */\n.social-text-spacing{margin-bottom:0px !important; padding-bottom:0px !important;}\n/* tmpl-11 preview */\n.social-text-spacing2{padding-top:15px !important;}\n/* UL bullet fixed in outlook */\nul {mso-special-format:bullet;}\n}@media screen{body{font-family:'Source Sans Pro','Verdana',Geneva,sans-serif;}}</style><!--[if gte mso 11]><style type=\"text/css\">table{border-spacing: 0; }table td {border-collapse: separate;}</style><![endif]--><!--[if !mso]><!--><style type=\"text/css\">table{border-spacing: 0;} table td {border-collapse: collapse;}</style> <!--<![endif]--><!--[if gte mso 15]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--></head><body><table border=\"0\" align=\"center\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" class=\"main-template\" bgcolor=\"#F2F3F7\" style=\"background-color: rgb(242, 243, 247);\">    <tbody><tr>        <td align=\"center\" valign=\"top\">        <!--[if gte mso 9]>                        <table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"590\" style=\"width:590px;\">                        <tr>                        <td align=\"center\" valign=\"top\" width=\"590\" style=\"width:590px;\">                        <![endif]-->            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"590\" class=\"templateContainer\" style=\"max-width:590px!important; width: 590px;\">        <tbody><tr>        <td align=\"center\" valign=\"top\">            <table class=\"rnb-del-min-width\" width=\"100%\" cellpadding=\"0\" border=\"0\" cellspacing=\"0\" style=\"min-width:590px;\" name=\"Layout_0\" id=\"Layout_0\">                <tbody><tr>                    <td class=\"rnb-del-min-width\" valign=\"top\" align=\"center\" style=\"min-width:590px;\">                        <a href=\"#\" name=\"Layout_0\"></a>                        <table width=\"100%\" cellpadding=\"0\" border=\"0\" height=\"38\" cellspacing=\"0\">                            <tbody><tr>                                <td valign=\"top\" height=\"38\">                                    <img width=\"20\" height=\"38\" style=\"display:block; max-height:38px; max-width:20px;\" alt=\"\" src=\"https://img.mailin.api.gouv.fr/im/2842821/15fd9f264001efa0668072cabf04073d203e1c628b776e87506daf3661b832d6.gif?e=pbMDzduVAgfroBvOCJQDgQcBeCSoiEmlA_WRk9-Pn2K-UkXpflnpKdzSp9CsnNq5dOSwQv5Kb2iQnQTSVmODM0THv6GLh6V4Gfl_6YP0pBLWDb2tXx-xnheMbaqogKZfCJeybxRvnFaxu79M5fzGvtCnnb6kp1laybdHmqvcKWKCT5vY31yoAZuKqVwFvF6e1YOujFUgwM7B1X-S5anyrH-pTfhcOLzrjojsCALJsYWuAZ2qsjIC97h9mDs2uUw6TYo\">                                </td>                            </tr>                        </tbody></table>                    </td>                </tr>            </tbody></table>            </td>    </tr><tr>        <td align=\"center\" valign=\"top\">            <div style=\"background-color: rgb(242, 243, 247);\">                <!--[if mso]>                <table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" style=\"width:100%;\">                <tr>                <![endif]-->                <!--[if mso]>                <td valign=\"top\" width=\"590\" style=\"width:590px;\">                <![endif]-->                <table class=\"rnb-del-min-width\" width=\"100%\" cellpadding=\"0\" border=\"0\" cellspacing=\"0\" style=\"min-width:100%; -webkit-backface-visibility: hidden; line-height: 10px;\" name=\"Layout_12\" id=\"Layout_12\">                <tbody><tr>                    <td class=\"rnb-del-min-width\" valign=\"top\" align=\"center\" style=\"min-width: 590px; padding-bottom: 20px;\">                        <a href=\"#\" name=\"Layout_12\"></a>                        <table width=\"100%\" class=\"rnb-container\" cellpadding=\"0\" border=\"0\" bgcolor=\"#F2F3F7\" align=\"center\" cellspacing=\"0\" style=\"background-color: rgb(242, 243, 247);\">                            <tbody><tr>                                <td valign=\"top\" align=\"left\">                                    <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">                                        <tbody><tr>                                            <td>                                                <div style=\"border-radius:0px; width:294;;max-width:294px !important;border-top:0px None #000;border-right:0px None #000;border-bottom:0px None #000;border-left:0px None #000;border-collapse: separate;border-radius: 0px;\">                                                    <div><img ng-if=\"col.img.source != 'url'\" border=\"0\" hspace=\"0\" vspace=\"0\" width=\"294\" class=\"rnb-header-img\" alt=\"\" style=\"display:block; float:left; border-radius: 0px; \" src=\"https://img.mailin.api.gouv.fr/im/2842821/dfb1a19865b02774a151e913227abd0136b01e4570631bc99d401b31544161c3.png?e=EYCKOBl86S1Mw_RTkTNFu0SFlWIMx8av4UTOVexTRirxi3lm95ad7gOOk4z3yNA1Vnc5jUwJ7RMOfwsYEfL_N4lg2sLdKqwxMpAowPOMK28tbYTJDifBEdMQx5LW1FdFXi4LXs-tYFQ4HrZjLBymMsOwAdXslY5W8ZzMZi0RX3_wKAk0XDS8xbf9XkkvQXaNAOxEpGqd1p_OGJ9Zgd7xUstzFLxXzO5nCa6ZQBLyx4aaTBg_A9w-gcNpVDoHkCoi56XNIe7CccBKanxUM-Eq9g_JdMqsqJiNuK35BCWzBjwgdg\"></div><div style=\"clear:both;\"></div>                                                    </div></td>                                        </tr>                                    </tbody></table>                                </td>                            </tr>                        </tbody></table>                    </td>                </tr></tbody></table>            <!--[if mso]>                </td>                <![endif]-->                <!--[if mso]>                </tr>                </table>                <![endif]-->        </div></td>    </tr><tr>        <td align=\"center\" valign=\"top\">            <div style=\"background-color: rgb(255, 255, 255); border-radius: 0px;\">                <!--[if mso]>                <table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" style=\"width:100%;\">                <tr>                <![endif]-->                <!--[if mso]>                <td valign=\"top\" width=\"590\" style=\"width:590px;\">                <![endif]-->                <table class=\"rnb-del-min-width\" width=\"100%\" cellpadding=\"0\" border=\"0\" cellspacing=\"0\" style=\"min-width:100%;\" name=\"Layout_22\">                <tbody><tr>                    <td class=\"rnb-del-min-width\" align=\"center\" valign=\"top\">                        <a href=\"#\" name=\"Layout_22\"></a>                        <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"rnb-container\" bgcolor=\"#ffffff\" style=\"background-color: rgb(255, 255, 255); padding-left: 20px; padding-right: 20px; border-collapse: separate; border-radius: 0px; border-bottom: 0px none rgb(200, 200, 200);\">                                        <tbody><tr>                                            <td height=\"20\" style=\"font-size:1px; line-height:20px; mso-hide: all;\">&nbsp;</td>                                        </tr>                                        <tr>                                            <td valign=\"top\" class=\"rnb-container-padding\" align=\"left\">                                                <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"rnb-columns-container\">                                                    <tbody><tr>                                                        <th class=\"rnb-force-col\" style=\"text-align: left; font-weight: normal; padding-right: 0px;\" valign=\"top\">                                                            <table border=\"0\" valign=\"top\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" align=\"left\" class=\"rnb-col-1\">                                                                <tbody><tr>                                                                    <td style=\"font-size:14px; font-family:Arial,Helvetica,sans-serif, sans-serif; color:#3c4858;\"><div>#{prenom_nom},</div><div><br>Nous vous informons que #{demandeur_email}, de l’organisation #{nom_raison_sociale}, vous a désigné(e) comme délégué à la protection des données pour accéder aux ressources de #{target_api_label}&nbsp;<span style=\"background-color: transparent;\">dans le cadre de la démarche « Fiabilisation des tiers ». Les détails de cette habilitation sont disponibles via le lien suivant : </span><a href=\"http://r.mailin.api.gouv.fr/tr/cl/hIG6bYMBEwY7l-4DX94Ux8-XoZmzH6UqEYU_9K0GlR_b2K42ICOvgqbOdXTZWGgM-o7uDjluirMqrCgS7gV0lAUMQLJ0_1F9piDFYY1vvXsCGeQQ5vhRzlnjPR4uK-p4mRn5S0iSToni2CVTjvNErTDcHexuyWgHITyLZHNm3vBTKu5KkYLiB6GPbERNpkkSdaN5oPm79Ut2x3ofyF54lI-BirUanYUfaPOntXRITKdbdXOP_zd3duwxEZY2fQ\" style=\"text-decoration: underline; color: rgb(0, 0, 145);\">https://datapass.api.gouv.fr/#{target_api}/#{enrollment_id}</a><span style=\"background-color: transparent;\">.</span></div><div>&nbsp;</div><div>Vous n’avez rien de plus à faire !<br><br><a href=\"mailto:contact@api.gouv.fr?subject=Erreur%20-%20Contact%20RGPD\" style=\"text-decoration: underline; color: rgb(0, 0, 145);\"><strong>Vous n’êtes pas délégué à la protection des données pour cette démarche ? Signalez-nous une erreur.</strong></a><br><br>Cordialement,<br><br>L'Équipe d'api.gouv.fr</div></td>                                                                </tr>                                                                </tbody></table>                                                            </th></tr>                                                </tbody></table></td>                                        </tr>                                        <tr>                                            <td height=\"20\" style=\"font-size:1px; line-height:20px; mso-hide: all;\">&nbsp;</td>                                        </tr>                                    </tbody></table>                    </td>                </tr>            </tbody></table><!--[if mso]>                </td>                <![endif]-->                <!--[if mso]>                </tr>                </table>                <![endif]-->            </div></td>    </tr><tr>        <td align=\"center\" valign=\"top\">            <div style=\"background-color: rgb(249, 250, 252); border-radius: 0px;\">                <!--[if mso]>                <table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" style=\"width:100%;\">                <tr>                <![endif]-->                <!--[if mso]>                <td valign=\"top\" width=\"590\" style=\"width:590px;\">                <![endif]-->                <table class=\"rnb-del-min-width\" width=\"100%\" cellpadding=\"0\" border=\"0\" cellspacing=\"0\" style=\"min-width:100%;\" name=\"Layout_8\">                <tbody><tr>                    <td class=\"rnb-del-min-width\" align=\"center\" valign=\"top\">                        <a href=\"#\" name=\"Layout_8\"></a>                        <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"rnb-container\" bgcolor=\"#f9fafc\" style=\"background-color: rgb(249, 250, 252); padding-left: 20px; padding-right: 20px; border-collapse: separate; border-radius: 0px; border-bottom: 0px none rgb(200, 200, 200);\">                                        <tbody><tr>                                            <td height=\"20\" style=\"font-size:1px; line-height:20px; mso-hide: all;\">&nbsp;</td>                                        </tr>                                        <tr>                                            <td valign=\"top\" class=\"rnb-container-padding\" align=\"left\">                                                <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"rnb-columns-container\">                                                    <tbody><tr>                                                        <th class=\"rnb-force-col\" style=\"text-align: left; font-weight: normal; padding-right: 0px;\" valign=\"top\">                                                            <table border=\"0\" valign=\"top\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" align=\"left\" class=\"rnb-col-1\">                                                                <tbody><tr>                                                                    <td style=\"font-size:14px; font-family:Arial,Helvetica,sans-serif, sans-serif; color:#3c4858;\"><div style=\"text-align: center;\"><span style=\"font-size:14px;\"><span style=\"color:#808080;\">api.gouv.fr est le point d’accès unique aux API de l’administration créé par la DINUM.</span></span></div><div style=\"text-align: center;\">&nbsp;</div><div style=\"text-align: center;\"><span style=\"font-size:14px;\"><a href=\"http://r.mailin.api.gouv.fr/tr/cl/KnX3IZm5ppaV4ixfHMj5fc_J_G3NNUeTev9uSyPNAC16RQSK4F0aLhMMLvni6cjf3x_eeKp9B0lBik4mzkE2qJaId4Cu9calN2RV-bZgRqgSeDQhdPhUOVWqbfHY-8OIv4ytj3J8ykz1ea65ivQDekqN3Fj_tLvUaxfLH4vbH94iCdo1f3yMAtPok5vxF1OgjVZVXL65_lV6iYXfRd5kU8tyO48xay1DM5MDhZPDQZ2nANW3YYVHv-UHEciI58l-eVpo1mtyDZJO_ynNcnij5aOhSBEoS6mJdrSvJt2ZtA\" style=\"text-decoration: underline; color: rgb(102, 102, 102);\">En savoir plus</a></span></div></td>                                                                </tr>                                                                </tbody></table>                                                            </th></tr>                                                </tbody></table></td>                                        </tr>                                        <tr>                                            <td height=\"20\" style=\"font-size:1px; line-height:20px; mso-hide: all;\">&nbsp;</td>                                        </tr>                                    </tbody></table>                    </td>                </tr>            </tbody></table><!--[if mso]>                </td>                <![endif]-->                <!--[if mso]>                </tr>                </table>                <![endif]-->            </div></td>    </tr><tr>        <td align=\"center\" valign=\"top\">            <table class=\"rnb-del-min-width\" width=\"100%\" cellpadding=\"0\" border=\"0\" cellspacing=\"0\" style=\"min-width:590px;\" name=\"Layout_13\" id=\"Layout_13\">                <tbody><tr>                    <td class=\"rnb-del-min-width\" valign=\"top\" align=\"center\" style=\"min-width:590px;\">                        <a href=\"#\" name=\"Layout_13\"></a>                        <table width=\"100%\" cellpadding=\"0\" border=\"0\" height=\"38\" cellspacing=\"0\">                            <tbody><tr>                                <td valign=\"top\" height=\"38\">                                    <img width=\"20\" height=\"38\" style=\"display:block; max-height:38px; max-width:20px;\" alt=\"\" src=\"https://img.mailin.api.gouv.fr/im/2842821/15fd9f264001efa0668072cabf04073d203e1c628b776e87506daf3661b832d6.gif?e=CbaP2zx8fkxejx3D07H6SK0biD8nJVnx49b_YPIopucFEynrI4DgoN5InStG9gehkEMoeli-Yeqi2w-4AS60MdZNoqeJPSwIZ7m1frwnDOAJEQ4FIdUIdeIuipOTK3b4IjeTZTcLh_m9_MCWUSQwsuYGrHxNgWO51VjgkoX9ryRx2EqP11i6LyzfMDL5zvc_ZFwl_Ax1uiUV8v62cwNjum5V_MzZCljZCTSDaSCoaiYx54G4IVGyo51pwsFZfoA5Vw0\">                                </td>                            </tr>                        </tbody></table>                    </td>                </tr>            </tbody></table>            </td>    </tr></tbody></table>            <!--[if gte mso 9]>                        </td>                        </tr>                        </table>                        <![endif]-->                        </td>        </tr>        </tbody></table></body></html>",
      attachmentCount: 0,
      templateId: 8
    }
  end

  def stub_send_mail_call(demandeur_email, instructor_email, enrollment_id)
    stub_request(:post, "https://api.sendinblue.com/v3/smtp/email")
      .with(
        headers: {
          "Content-Type" => "application/json"
        },
        body: send_mail_payload(
          demandeur_email,
          instructor_email,
          "FranceConnect",
          "franceconnect",
          enrollment_id
        ).to_json
      )
      .to_return(status: 200, body: "", headers: {})
  end

  def send_mail_payload(demandeur_email, instructor_email, target_api_label, target_api, enrollment_id)
    {
      sender:
        {name: "L’équipe DataPass", email: "datapass@api.gouv.fr"},
      to: [
        {email: [demandeur_email]}
      ],
      cc: [
        {email: "datapass@api.gouv.fr"},
        {email: instructor_email}
      ],
      subject: "Votre habilitation à FranceConnect",
      replyTo: {name: "L’équipe DataPass", email: "datapass@api.gouv.fr"},
      templateId: 13,
      params: {
        target_api_label: target_api_label,
        enrollment_id: enrollment_id,
        date: nil,
        rgpd_role: "délégué à la protection des données",
        rgpd_contact_email: "mairie@ville.fr",
        url: "datapass-development.api.gouv.fr/#{target_api}/#{enrollment_id}"
      },
      tags: ["rgpd-contact-error"]
    }
  end
end
