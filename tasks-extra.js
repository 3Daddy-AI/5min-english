// 追加の4技能課題。app.js の taskPools に読み込み時にマージされる。
// 各スキル3問だと dayNumber % 3 で3日ごとに同じ問題が戻ってくるため、ここで倍に増やす。
// 英文（m / x / s）は必ず下の ExtraTranslations に日本語訳を用意すること
// （app.js の checkTranslations() が抜けを検出してコンソールに警告する）。

window.ExtraTaskPools = {
  travel: {
    basic: {
      speaking: [
        { t: "荷物を預ける", p: "フロントで、チェックアウト後に荷物を預かってもらえるか聞いてください。", m: "Could I leave my luggage here after checkout?", k: ["could i", "luggage", "checkout"] },
        { t: "写真を頼む", p: "通りすがりの人に、写真を撮ってもらえるようお願いしてください。", m: "Excuse me, could you take a picture of us, please?", k: ["excuse me", "could you", "picture"] },
        { t: "会計を頼む", p: "レストランで、お会計をお願いし、カードが使えるかも聞いてください。", m: "Could we have the bill, please? Do you take credit cards?", k: ["bill", "please", "cards"] }
      ],
      writing: [
        { t: "レイトチェックアウトの依頼", p: "ホテルに、14時までのレイトチェックアウトが可能か尋ねるメッセージを書いてください。", m: "Hello, could we check out at 2 p.m. instead of 11? We can pay an extra fee if needed. Thank you.", k: ["could we", "instead of", "extra"] },
        { t: "予約の変更", p: "レストランの予約を、2名から4名に変更したいと伝えてください。", m: "Hi, I'd like to change my reservation from two people to four. Is that possible?", k: ["i'd like", "change", "possible"] },
        { t: "遅れる連絡", p: "待ち合わせの相手に、道に迷って10分遅れると伝えるメッセージを書いてください。", m: "Sorry, I got lost and I will be about ten minutes late. I'm on my way now.", k: ["sorry", "late", "on my way"] }
      ],
      reading: [
        { t: "バスの時刻表", x: "The airport bus leaves every 20 minutes from 6:00 to 22:00. After 22:00, please use the night taxi at Gate 3.", q: "22時以降に空港へ行くには？", choices: ["20分ごとのバスに乗る", "3番ゲートのナイトタクシーを使う", "翌朝6時まで待つ"], correct: 1 },
        { t: "レストランの案内", x: "Lunch is served until 3 p.m. Dinner starts at 5:30 p.m. The kitchen is closed between these hours.", q: "午後4時に食事はできる？", choices: ["ランチが食べられる", "ディナーが食べられる", "厨房が閉まっていて食べられない"], correct: 2 },
        { t: "手荷物の規定", x: "Each passenger may carry one bag up to 7 kg. Larger bags must be checked in at the counter for a fee.", q: "8kgのバッグはどうなる？", choices: ["そのまま機内に持ち込める", "カウンターで有料で預ける", "持ち込みも預けもできない"], correct: 1 }
      ],
      listening: [
        { t: "搭乗案内", s: "Flight 42 to London is now boarding at gate 7. Please have your passport ready." },
        { t: "朝食の案内", s: "Breakfast is served in the main hall from seven to ten. Your room number is needed at the entrance." },
        { t: "遅延の放送", s: "We are sorry for the delay. This train will arrive at Central Station about fifteen minutes late." }
      ]
    },
    plus: {
      speaking: [
        { t: "紛失した荷物の相談", p: "空港のカウンターで、預けた荷物が出てこないことを伝え、対応を尋ねてください。", m: "My checked bag didn't arrive. Could you track it and tell me when it will be delivered to my hotel?", k: ["didn't arrive", "track", "delivered"] },
        { t: "値段の交渉", p: "市場で、複数個買うので割引できないか交渉してください。", m: "If I take three of these, could you give me a small discount?", k: ["if i take", "discount", "could you"] },
        { t: "体調不良を伝える", p: "薬局で、二日前から喉が痛く熱もあると伝えて、薬をすすめてもらってください。", m: "I've had a sore throat for two days and a slight fever. What would you recommend?", k: ["sore throat", "fever", "recommend"] }
      ],
      writing: [
        { t: "部屋の不備を伝える", p: "予約と違う部屋に案内されたことを伝え、部屋の変更か返金を求めるメールを書いてください。", m: "The room we received is not the one we booked. We would appreciate either a move to the correct room or a partial refund.", k: ["not the one", "appreciate", "refund"] },
        { t: "旅程の相談", p: "現地ガイドに、3日間で回りたい場所を伝え、効率的な順番を提案してもらうメールを書いてください。", m: "We have three days and hope to see the old town, the coast, and the mountains. Could you suggest the most efficient order?", k: ["three days", "suggest", "efficient"] },
        { t: "公平なレビュー", p: "清潔さは良かったが騒音がひどかった宿について、公平なレビューを書いてください。", m: "The room was spotless and the staff were kind, but street noise made it hard to sleep. Bring earplugs and it's good value.", k: ["spotless", "noise", "value"] }
      ],
      reading: [
        { t: "キャンセル規定", x: "Cancellations made more than 14 days before arrival are fully refunded. Within 14 days, 50% is charged. No-shows are charged in full.", q: "到着10日前にキャンセルするとどうなる？", choices: ["全額返金される", "50%が請求される", "全額請求される"], correct: 1 },
        { t: "レンタカーの条件", x: "Drivers must be over 21 and hold a licence for at least one year. An international permit is required for non-EU licences.", q: "EU外の免許を持つ22歳の人に必要なものは？", choices: ["国際運転許可証", "追加の保険のみ", "特に何も要らない"], correct: 0 },
        { t: "入場の注意書き", x: "The last entry is 30 minutes before closing. Large backpacks must be left in the lockers, which close 10 minutes after the museum.", q: "閉館30分前に着いたらどうなる？", choices: ["ちょうど最終入場に間に合う", "すでに入場できない", "ロッカーだけ使える"], correct: 0 }
      ],
      listening: [
        { t: "税関での質問", s: "Do you have anything to declare? Please open your bag and show me the items you bought." },
        { t: "ツアーの集合案内", s: "The walking tour starts at nine sharp in front of the fountain. Please wear comfortable shoes and bring water." },
        { t: "欠航の案内", s: "Due to the storm, all flights to the north are canceled today. Please visit the service desk to rebook." }
      ]
    }
  },

  business: {
    basic: {
      speaking: [
        { t: "議事録の共有を頼む", p: "会議に出られなかったので、議事録を共有してもらえるか頼んでください。", m: "Could you share the meeting notes with me? I couldn't join today.", k: ["could you", "share", "notes"] },
        { t: "進捗を伝える", p: "資料は8割できていて、明日中に終わると伝えてください。", m: "The document is about eighty percent done. I will finish it by tomorrow.", k: ["percent", "done", "by tomorrow"] },
        { t: "手伝いを申し出る", p: "忙しそうな同僚に、何か手伝えることはないか声をかけてください。", m: "You look busy. Is there anything I can help with?", k: ["busy", "anything", "help"] }
      ],
      writing: [
        { t: "面談の日程調整", p: "来週の面談について、水曜の午後か木曜の午前で調整したいと書いてください。", m: "Would Wednesday afternoon or Thursday morning work for you? Please let me know which is better.", k: ["work for you", "let me know", "better"] },
        { t: "資料の修正依頼", p: "送られた資料の数字が古いので、最新版に差し替えてほしいと丁寧に頼んでください。", m: "Thank you for the file. The figures look a little old. Could you send the latest version when you have time?", k: ["thank you", "could you", "latest"] },
        { t: "打ち合わせのお礼", p: "打ち合わせのお礼と、決まったことを一行でまとめたメールを書いてください。", m: "Thank you for your time today. To confirm, we will start the test in June and review it in July.", k: ["thank you", "to confirm", "we will"] }
      ],
      reading: [
        { t: "社内のお知らせ", x: "The Wi-Fi will be down on Saturday from 9 a.m. to 1 p.m. for maintenance. Please save your work before you leave on Friday.", q: "金曜に社員がすべきことは？", choices: ["土曜に出社する", "退社前に作業を保存する", "Wi-Fiの設定を変える"], correct: 1 },
        { t: "経費のルール", x: "Meals under $30 do not need a receipt. Anything above must be submitted with a photo of the receipt within one week.", q: "45ドルの食事代はどうする？", choices: ["申請の必要はない", "1週間以内にレシート写真を提出する", "上司の口頭承認だけでよい"], correct: 1 },
        { t: "会議室の予約", x: "Room A holds 12 people and has a screen. Room B holds 6 and does not. Book through the shared calendar at least one day ahead.", q: "10人でスクリーンを使う会議を開くには？", choices: ["Room Aを前日までに予約する", "Room Bを当日予約する", "予約なしでRoom Aを使う"], correct: 0 }
      ],
      listening: [
        { t: "電話の伝言", s: "Mr. Brown called while you were out. He asks you to call him back before five today." },
        { t: "社内アナウンス", s: "Please remember that the office will close early on Friday. All staff should leave by three." },
        { t: "打ち合わせの確認", s: "Just to confirm, we meet at ten in room B, and Sarah will bring the printed handouts." }
      ]
    },
    plus: {
      speaking: [
        { t: "実施時期の見直しを提案", p: "提案には賛成だが時期に懸念があると伝え、代案を出してください。", m: "I agree with the idea in principle, but the timing worries me. Could we start after the audit instead?", k: ["agree", "timing", "instead"] },
        { t: "交渉で条件を出す", p: "値下げは難しいが、支払い期間を延ばすことは可能だと伝えてください。", m: "We can't lower the price, but we could extend the payment period to 60 days.", k: ["lower the price", "extend", "payment"] },
        { t: "未達の報告", p: "数字が目標に届かなかった原因と、次の打ち手を簡潔に報告してください。", m: "We came in ten percent under target, mainly due to the delayed launch. Next month we will focus on the enterprise segment.", k: ["under target", "due to", "focus on"] }
      ],
      writing: [
        { t: "納期遅延のお詫び", p: "部品の遅れで納品が1週間遅れることを謝罪し、新しい日程を伝えるメールを書いてください。", m: "We are sorry to inform you that delivery will be delayed by one week due to a parts shortage. The new date is June 14, and we will cover the shipping cost.", k: ["sorry to inform", "delayed", "new date"] },
        { t: "上司への提案", p: "作業が重複しているので、ツールを一本化したいと理由つきで提案してください。", m: "We currently track the same tasks in two tools, which costs us about three hours a week. I suggest we move everything to one system by the end of the quarter.", k: ["costs us", "i suggest", "one system"] },
        { t: "値上げの通知", p: "原材料費の高騰により、来期から5%の値上げをお願いする通知を書いてください。", m: "Due to rising material costs, we will need to raise our prices by 5% from the next term. We have kept the increase as small as possible.", k: ["due to", "raise", "as small as possible"] }
      ],
      reading: [
        { t: "人事評価の案内", x: "Self-reviews are due March 1. Manager reviews follow by March 15, and final ratings are shared in the first week of April.", q: "3月10日の時点で終わっているのは？", choices: ["自己評価のみ", "自己評価と上司評価の両方", "最終評価まですべて"], correct: 0 },
        { t: "契約の解約条項", x: "Either party may end this agreement with 60 days' written notice. Early termination without notice incurs a fee equal to three months of service.", q: "通知なしで即解約するとどうなる？", choices: ["費用はかからない", "3か月分の料金がかかる", "60日分の料金がかかる"], correct: 1 },
        { t: "売上の分析", x: "Online sales rose 22% while store sales fell 8%. The overall gain was modest because stores still account for two thirds of revenue.", q: "全体の伸びが小さかった理由は？", choices: ["オンラインが伸びなかったから", "店舗が売上の3分の2を占めるから", "値上げをしたから"], correct: 1 }
      ],
      listening: [
        { t: "四半期の報告", s: "Revenue grew by twelve percent this quarter, but costs rose as well, so profit stayed almost flat." },
        { t: "人員配置の相談", s: "We are short one designer for the June launch. I suggest we move Kate from the internal project for six weeks." },
        { t: "クライアントとの電話", s: "They liked the proposal overall, but they want the price broken down by phase before they sign." }
      ]
    }
  },

  study: {
    basic: {
      speaking: [
        { t: "説明をもう一度頼む", p: "先生に、今の説明をもう一度お願いしたいと丁寧に頼んでください。", m: "Sorry, could you explain that part again? I didn't quite follow.", k: ["could you", "again", "follow"] },
        { t: "グループで提案する", p: "グループ活動で、まず役割を決めようと提案してください。", m: "Shall we decide who does what first? I can take the research part.", k: ["shall we", "who does what", "i can take"] },
        { t: "欠席の連絡", p: "体調不良で明日の授業を休むと伝え、課題の提出方法を尋ねてください。", m: "I'm not feeling well, so I can't come to class tomorrow. Should I send the assignment by email?", k: ["not feeling well", "can't come", "by email"] }
      ],
      writing: [
        { t: "教授へのアポイント依頼", p: "レポートの相談で、オフィスアワーに伺いたいとメールを書いてください。", m: "Could I visit your office hours on Thursday to discuss my report? I have two questions about the sources.", k: ["could i", "office hours", "questions"] },
        { t: "グループへの連絡", p: "次の集まりを金曜の16時に図書館でと提案するメッセージを書いてください。", m: "How about meeting at the library at four on Friday? Please let me know if that doesn't work.", k: ["how about", "let me know", "doesn't work"] },
        { t: "記事の要約", p: "読んだ記事の要点を2文でまとめてください。", m: "The article argues that short daily study beats long weekend sessions. The author supports this with a study of 200 students.", k: ["argues", "supports", "study"] }
      ],
      reading: [
        { t: "シラバスの規定", x: "Attendance counts for 10% of the grade. Students who miss more than four classes cannot pass, regardless of test scores.", q: "5回欠席した学生はどうなる？", choices: ["10%減点されるだけ", "テストが良ければ合格できる", "合格できない"], correct: 2 },
        { t: "図書館の利用案内", x: "Books may be borrowed for two weeks and renewed once online. Renewals are not possible if another student has reserved the book.", q: "他の学生が予約している本は？", choices: ["オンラインで1回延長できる", "延長できない", "2週間より長く借りられる"], correct: 1 },
        { t: "課題の指示", x: "Write 800 to 1,000 words. Include at least three academic sources. Wikipedia may be used to find sources but not cited directly.", q: "Wikipediaの扱いは？", choices: ["出典として引用してよい", "出典探しには使えるが引用は不可", "一切使ってはいけない"], correct: 1 }
      ],
      listening: [
        { t: "授業の連絡", s: "Next week's class will be online. The link will be posted on the course page on Monday morning." },
        { t: "提出物の説明", s: "Your essay is due on Friday at noon. Late work loses five percent for each day." },
        { t: "実験の注意", s: "Before you start, put on your safety glasses and read the whole procedure once." }
      ]
    },
    plus: {
      speaking: [
        { t: "根拠を示して論じる", p: "自分の主張に、具体的なデータを一つ添えて述べてください。", m: "I think remote classes work for lectures but not for labs. In our own survey, lab scores dropped by fifteen percent online.", k: ["i think", "in our own", "dropped"] },
        { t: "答えられない質問への対応", p: "答えが分からない質問に対し、誠実に対応してください。", m: "That's a good question. I don't have the data with me, but I can check it and email you by Friday.", k: ["good question", "don't have", "i can check"] },
        { t: "研究計画を説明する", p: "研究テーマと方法を30秒で説明してください。", m: "I'm studying how sleep affects vocabulary retention. I'll test forty students over four weeks, half with a fixed sleep schedule.", k: ["i'm studying", "i'll test", "over four weeks"] }
      ],
      writing: [
        { t: "研究計画の要旨", p: "研究の目的・方法・期待される結果を3文で書いてください。", m: "This study asks whether spaced review improves long-term retention more than massed review. Sixty learners will study the same 100 words under two schedules for six weeks. We expect the spaced group to retain significantly more words.", k: ["this study", "we expect", "retention"] },
        { t: "反論を含む段落", p: "ある主張を認めた上で、反論を述べる段落を書いてください。", m: "Critics argue that online degrees lack networking value, and this is partly true. However, structured virtual cohorts now produce contact networks comparable to those of campus programs.", k: ["critics argue", "partly true", "however"] },
        { t: "指導教員への相談", p: "データが想定と違ったため、分析方法を変えたいと相談するメールを書いてください。", m: "The data did not follow a normal distribution, so the planned test may not be appropriate. Would you agree to a different method instead?", k: ["did not follow", "would you agree", "instead"] }
      ],
      reading: [
        { t: "研究倫理の規定", x: "Studies involving human participants require ethics approval before any data is collected. Approval typically takes four weeks and cannot be granted retroactively.", q: "データを取ってから申請したらどうなる？", choices: ["4週間後に承認される", "遡っての承認はされない", "条件つきで承認される"], correct: 1 },
        { t: "論文の抄録", x: "While earlier work linked screen time to poor sleep, this study finds the effect disappears once bedtime is held constant, suggesting timing rather than screens is the key factor.", q: "この研究の結論は？", choices: ["画面時間そのものが睡眠を悪くする", "就寝時刻を揃えると影響は消え、時刻が要因", "画面時間と睡眠は無関係だと証明された"], correct: 1 },
        { t: "奨学金の条件", x: "Applicants must maintain a 3.2 GPA and complete 20 hours of community service each term. Failure in either requirement suspends funding for the following term.", q: "GPAは満たしたが奉仕活動が10時間だった場合は？", choices: ["翌学期の支給が止まる", "警告のみで支給は続く", "半額が支給される"], correct: 0 }
      ],
      listening: [
        { t: "講義の要点", s: "Today's main point is simple: correlation tells us two things move together, but it never proves one causes the other." },
        { t: "ゼミの進行", s: "Each of you will present for ten minutes, followed by five minutes of questions from the group." },
        { t: "発表への講評", s: "Your method section was clear, but the sample was too small to support such a strong conclusion." }
      ]
    }
  },

  exam: {
    basic: {
      speaking: [
        { t: "写真を描写する", p: "公園で子どもがボールで遊んでいる写真を、2文で描写してください。", m: "There are two children playing with a ball in a park. It looks like a sunny afternoon.", k: ["there are", "playing", "looks like"] },
        { t: "簡単な意見を述べる", p: "朝型と夜型のどちらが良いか、理由を一つ添えて答えてください。", m: "I prefer studying in the morning because my mind is clearer then.", k: ["i prefer", "because", "clearer"] },
        { t: "日課を説明する", p: "平日の朝の習慣を3文で説明してください。", m: "I usually get up at six. I have coffee and check the news. Then I leave home at seven thirty.", k: ["usually", "then", "leave"] }
      ],
      writing: [
        { t: "短い意見文", p: "制服に賛成か反対か、理由を1つ書いてください。", m: "I am against school uniforms because students should learn to choose for themselves.", k: ["i am against", "because", "choose"] },
        { t: "グラフを1文で説明", p: "2010年から2020年で利用者が2倍になったグラフを1文で説明してください。", m: "The number of users doubled between 2010 and 2020.", k: ["doubled", "between"] },
        { t: "招待への返信", p: "招待に対し参加できると伝え、持ち物を尋ねる返信を書いてください。", m: "Thank you for the invitation. I can come on Saturday. Is there anything I should bring?", k: ["thank you", "i can come", "should bring"] }
      ],
      reading: [
        { t: "短い説明文", x: "Bamboo is not a tree but a grass. Some kinds can grow almost one metre in a single day.", q: "本文によると竹とは？", choices: ["木の一種である", "草の一種である", "必ず1日1メートル伸びる"], correct: 1 },
        { t: "広告文", x: "Buy two shirts and get the third free. The offer ends Sunday and cannot be combined with other discounts.", q: "シャツを3枚買うと？", choices: ["1枚が無料になる", "3枚とも割引になる", "他の割引と併用できる"], correct: 0 },
        { t: "施設のお知らせ", x: "The swimming pool will be closed for cleaning on Tuesday morning and will reopen at 1 p.m.", q: "火曜の午前中は？", choices: ["清掃のため閉まっている", "通常どおり使える", "一日中閉まっている"], correct: 0 }
      ],
      listening: [
        { t: "試験の指示", s: "Please write your name at the top of the page and do not turn it over until I say so." },
        { t: "天気予報", s: "It will be cloudy in the morning with rain in the afternoon. The temperature will reach eighteen degrees." },
        { t: "店内放送", s: "The store will close in fifteen minutes. Please bring your items to the counter." }
      ]
    },
    plus: {
      speaking: [
        { t: "賛否を論じる", p: "在宅勤務の是非について、利点と欠点を1つずつ挙げて意見をまとめてください。", m: "Remote work saves commuting time and helps focus, but it weakens informal learning between colleagues. On balance, I support a hybrid model.", k: ["saves", "but", "on balance"] },
        { t: "図表を比較する", p: "2つの都市の降水量を比較し、傾向を述べてください。", m: "City A gets most of its rain in summer, while City B is fairly even all year. The annual totals, however, are almost the same.", k: ["while", "fairly even", "however"] },
        { t: "仮定の状況に答える", p: "もし1年間自由に使えるなら何をするか、理由とともに述べてください。", m: "If I had a free year, I would work abroad rather than travel, because living somewhere teaches you far more than visiting it.", k: ["if i had", "rather than", "because"] }
      ],
      writing: [
        { t: "意見エッセイの導入", p: "「試験は学習を測る良い方法か」について、立場を示す導入段落を書いてください。", m: "Examinations remain the standard way to measure learning, yet they capture only what can be recalled under pressure. This essay argues that continuous assessment gives a fairer picture of ability.", k: ["yet", "this essay argues", "fairer"] },
        { t: "読解と講義の対立をまとめる", p: "読解文の主張と講義の反論を1段落でまとめてください。", m: "The reading claims that four-day weeks reduce output. The lecture disputes this, citing trials in which weekly output held steady while sick leave fell by a third.", k: ["claims", "disputes", "citing"] },
        { t: "データの記述", p: "3つのエネルギー源の割合の変化を、要点を絞って記述してください。", m: "Between 2015 and 2025, renewables climbed from 12% to 34%, coal halved to 18%, and gas remained the largest source at around 40%.", k: ["climbed", "halved", "remained"] }
      ],
      reading: [
        { t: "論説の主張", x: "Supporters of nuclear power point to its low emissions, but the debate has shifted: the binding constraint is no longer safety or carbon, but the decade it takes to build a plant.", q: "筆者によれば、現在の主な制約は？", choices: ["安全性", "二酸化炭素の排出量", "建設にかかる期間"], correct: 2 },
        { t: "研究の限界", x: "The trial showed clear benefits, but participants were volunteers aged 20 to 30 from a single city, so the findings may not extend to older or rural populations.", q: "この研究の弱点は？", choices: ["効果が確認できなかったこと", "参加者が偏っていて一般化しにくいこと", "期間が短すぎたこと"], correct: 1 },
        { t: "対比を読み取る", x: "Whereas the first survey asked how people felt about the policy, the second measured what they actually did. The gap between the two is the point of interest.", q: "2つの調査の違いは？", choices: ["感情を聞いたか、実際の行動を測ったか", "対象年齢が違う", "調査地域が違う"], correct: 0 }
      ],
      listening: [
        { t: "講義の導入", s: "Today we will look at why some languages have many words for a single idea, and what that tells us about culture." },
        { t: "研究の説明", s: "The team followed one thousand people for ten years, recording their diet, exercise, and sleep every six months." },
        { t: "討論の一部", s: "I accept that the cost is high. What I question is whether the alternative would actually be any cheaper." }
      ]
    }
  },

  daily: {
    basic: {
      speaking: [
        { t: "週末の予定を聞く", p: "友人に週末の予定を尋ね、自分の予定も伝えてください。", m: "What are you doing this weekend? I'm thinking of going to the new bakery.", k: ["what are you doing", "i'm thinking of"] },
        { t: "褒める", p: "友人の新しい髪型を褒めてください。", m: "I love your new haircut! It really suits you.", k: ["i love", "suits you"] },
        { t: "やんわり断る", p: "今夜の誘いを、疲れているのでまた今度と丁寧に断ってください。", m: "Thanks for asking, but I'm pretty tired tonight. Can we do it another time?", k: ["thanks for asking", "tired", "another time"] }
      ],
      writing: [
        { t: "お祝いのメッセージ", p: "友人の就職を祝うメッセージを書いてください。", m: "Congratulations on the new job! You worked so hard for this. Let's celebrate soon.", k: ["congratulations", "worked so hard", "celebrate"] },
        { t: "お願いのメッセージ", p: "旅行中、猫の世話をお願いするメッセージを書いてください。", m: "Would you mind feeding my cat while I'm away next week? I'll leave the food and a key.", k: ["would you mind", "while i'm away", "i'll leave"] },
        { t: "近況を伝える", p: "最近始めた習慣について友人に伝えるメッセージを書いてください。", m: "I started running twice a week last month. It's hard, but I sleep so much better now.", k: ["i started", "it's hard", "better"] }
      ],
      reading: [
        { t: "友人からのメモ", x: "I've left your book on the kitchen table. The keys are with the neighbour, and the plants need water on Wednesday.", q: "水曜にすることは？", choices: ["本を返す", "植物に水をやる", "隣人に鍵を渡す"], correct: 1 },
        { t: "イベントの案内", x: "The picnic starts at 11. Bring one dish to share. If it rains, we'll move to Mia's flat instead.", q: "雨が降ったら？", choices: ["中止になる", "ミアの家で行う", "11時より遅らせる"], correct: 1 },
        { t: "グループチャット", x: "Sorry everyone, I'm stuck at work and will be about an hour late. Please start without me and save me a seat.", q: "送り主が頼んでいることは？", choices: ["1時間待ってほしい", "先に始めて席を取っておいてほしい", "日を改めてほしい"], correct: 1 }
      ],
      listening: [
        { t: "友人からの留守電", s: "Hi, it's me. I'm running late, so let's meet at seven instead of six thirty. Sorry about that." },
        { t: "注文の確認", s: "So that's one large latte and a slice of carrot cake. Would you like it to eat in or take away?" },
        { t: "近所の人との会話", s: "They're fixing the road tomorrow, so it might be noisy from early in the morning." }
      ]
    },
    plus: {
      speaking: [
        { t: "気まずい話を切り出す", p: "友人に貸したお金を、関係を壊さずに返してもらうよう切り出してください。", m: "I hate to bring this up, but do you remember the money from last month? No rush, I just wanted to mention it.", k: ["bring this up", "do you remember", "no rush"] },
        { t: "意見の違いを扱う", p: "友人と意見が違うとき、相手を尊重しつつ自分の考えを述べてください。", m: "I see why you feel that way, and you might be right. For me though, the timing just doesn't feel right yet.", k: ["i see why", "might be right", "for me though"] },
        { t: "失敗談を語る", p: "印象に残っている失敗と、そこから学んだことを話してください。", m: "I once missed a flight because I trusted the wrong timetable. Since then I always check twice and arrive early.", k: ["i once", "since then", "check twice"] }
      ],
      writing: [
        { t: "謝罪のメッセージ", p: "約束を忘れてしまったことを謝り、埋め合わせを提案するメッセージを書いてください。", m: "I'm really sorry about yesterday. I mixed up the dates and completely forgot. Let me make it up to you with dinner this week.", k: ["really sorry", "mixed up", "make it up"] },
        { t: "励ましのメッセージ", p: "仕事で落ち込んでいる友人に、具体的な支えを申し出るメッセージを書いてください。", m: "That sounds exhausting, and anyone would feel low after a week like that. I'm free Saturday if you want to talk.", k: ["sounds exhausting", "anyone would", "i'm free"] },
        { t: "転職と引っ越しを報告する", p: "半年ぶりの友人に、仕事・住まい・趣味の近況を伝えるメールを書いてください。", m: "It's been ages! I changed teams in April, which was stressful at first but suits me much better now. We also moved to a smaller place near the river. How have you been?", k: ["it's been ages", "at first", "how have you been"] }
      ],
      reading: [
        { t: "含みのあるメッセージ", x: "I'm not saying I don't want to go. I just think a whole weekend with twelve people might be a lot for me right now.", q: "送り主の気持ちは？", choices: ["行きたくないとはっきり断っている", "行きたい気持ちはあるが規模が負担", "日程が合わないだけ"], correct: 1 },
        { t: "レビューを読み取る", x: "The food was genuinely excellent, and I'd go back for that alone. That said, we waited fifty minutes for a table despite booking, which soured the evening.", q: "この評価をまとめると？", choices: ["料理も接客も良かった", "料理は良いが待ち時間に不満", "二度と行きたくない"], correct: 1 },
        { t: "SNSの投稿", x: "Three months into living alone: the silence still catches me off guard some evenings, but I've stopped dreading it. Small win.", q: "投稿者の変化は？", choices: ["静けさが怖くなくなってきた", "一人暮らしをやめた", "まだ全く慣れていない"], correct: 0 }
      ],
      listening: [
        { t: "相談を受ける", s: "I don't know what to do. The job pays better, but I'd have to move away from everyone I know." },
        { t: "思い出話", s: "We got completely lost that night, ended up at a tiny festival, and somehow it became the best part of the trip." },
        { t: "予定の調整", s: "I could do Thursday evening, or any time Sunday. Whatever is easier for you, honestly." }
      ]
    }
  }
};

// 上の m / x / s に対応する日本語訳
window.ExtraTranslations = {
  /* travel basic */
  "Could I leave my luggage here after checkout?": "チェックアウトの後、ここに荷物を預けてもいいですか。",
  "Excuse me, could you take a picture of us, please?": "すみません、私たちの写真を撮っていただけますか。",
  "Could we have the bill, please? Do you take credit cards?": "お会計をお願いできますか。クレジットカードは使えますか。",
  "Hello, could we check out at 2 p.m. instead of 11? We can pay an extra fee if needed. Thank you.": "こんにちは。11時ではなく14時にチェックアウトできますか。必要なら追加料金を払います。よろしくお願いします。",
  "Hi, I'd like to change my reservation from two people to four. Is that possible?": "こんにちは。予約を2名から4名に変更したいのですが、可能でしょうか。",
  "Sorry, I got lost and I will be about ten minutes late. I'm on my way now.": "ごめん、道に迷って10分ほど遅れます。今向かっています。",
  "The airport bus leaves every 20 minutes from 6:00 to 22:00. After 22:00, please use the night taxi at Gate 3.": "空港バスは6時から22時まで20分ごとに出ます。22時以降は3番ゲートのナイトタクシーをご利用ください。",
  "Lunch is served until 3 p.m. Dinner starts at 5:30 p.m. The kitchen is closed between these hours.": "ランチは15時まで提供されます。ディナーは17時30分開始です。その間、厨房は閉まっています。",
  "Each passenger may carry one bag up to 7 kg. Larger bags must be checked in at the counter for a fee.": "お客様一人につき7kgまでのバッグを1つ持ち込めます。それより大きい荷物は、カウンターで有料でお預けください。",
  "Flight 42 to London is now boarding at gate 7. Please have your passport ready.": "ロンドン行き42便は、ただいま7番ゲートで搭乗を開始しています。パスポートをご用意ください。",
  "Breakfast is served in the main hall from seven to ten. Your room number is needed at the entrance.": "朝食はメインホールで7時から10時まで提供されます。入口で部屋番号が必要です。",
  "We are sorry for the delay. This train will arrive at Central Station about fifteen minutes late.": "遅延をお詫びします。この列車はセントラル駅に約15分遅れて到着します。",

  /* travel plus */
  "My checked bag didn't arrive. Could you track it and tell me when it will be delivered to my hotel?": "預けた荷物が出てきませんでした。追跡して、ホテルにいつ届くか教えていただけますか。",
  "If I take three of these, could you give me a small discount?": "これを3つ買ったら、少し値引きしていただけますか。",
  "I've had a sore throat for two days and a slight fever. What would you recommend?": "2日前から喉が痛く、微熱もあります。何かおすすめはありますか。",
  "The room we received is not the one we booked. We would appreciate either a move to the correct room or a partial refund.": "案内された部屋は予約したものと違います。正しい部屋への移動か、一部返金をお願いできれば幸いです。",
  "We have three days and hope to see the old town, the coast, and the mountains. Could you suggest the most efficient order?": "3日間あり、旧市街と海岸と山を見たいと思っています。最も効率の良い順番を提案していただけますか。",
  "The room was spotless and the staff were kind, but street noise made it hard to sleep. Bring earplugs and it's good value.": "部屋はとても清潔でスタッフも親切でしたが、通りの騒音で眠りにくかったです。耳栓を持参すれば、値段以上の価値があります。",
  "Cancellations made more than 14 days before arrival are fully refunded. Within 14 days, 50% is charged. No-shows are charged in full.": "到着の14日より前のキャンセルは全額返金されます。14日以内は50%が請求されます。無連絡不泊は全額請求です。",
  "Drivers must be over 21 and hold a licence for at least one year. An international permit is required for non-EU licences.": "運転者は21歳以上で、免許を1年以上保有している必要があります。EU外の免許には国際運転許可証が必要です。",
  "The last entry is 30 minutes before closing. Large backpacks must be left in the lockers, which close 10 minutes after the museum.": "最終入場は閉館の30分前です。大きなリュックはロッカーに預ける必要があり、ロッカーは博物館の10分後に閉まります。",
  "Do you have anything to declare? Please open your bag and show me the items you bought.": "申告するものはありますか。バッグを開けて、購入した品物を見せてください。",
  "The walking tour starts at nine sharp in front of the fountain. Please wear comfortable shoes and bring water.": "ウォーキングツアーは9時ちょうどに噴水の前から始まります。歩きやすい靴で、水をお持ちください。",
  "Due to the storm, all flights to the north are canceled today. Please visit the service desk to rebook.": "嵐のため、本日の北方面の便はすべて欠航です。予約の取り直しはサービスデスクへお越しください。",

  /* business basic */
  "Could you share the meeting notes with me? I couldn't join today.": "議事録を共有していただけますか。今日は参加できませんでした。",
  "The document is about eighty percent done. I will finish it by tomorrow.": "資料は8割ほどできています。明日までに仕上げます。",
  "You look busy. Is there anything I can help with?": "お忙しそうですね。何か手伝えることはありますか。",
  "Would Wednesday afternoon or Thursday morning work for you? Please let me know which is better.": "水曜の午後か木曜の午前はご都合いかがでしょうか。どちらが良いかお知らせください。",
  "Thank you for the file. The figures look a little old. Could you send the latest version when you have time?": "ファイルをありがとうございます。数字が少し古いようです。お手すきのときに最新版を送っていただけますか。",
  "Thank you for your time today. To confirm, we will start the test in June and review it in July.": "本日はお時間をありがとうございました。確認ですが、6月にテストを開始し、7月に見直します。",
  "The Wi-Fi will be down on Saturday from 9 a.m. to 1 p.m. for maintenance. Please save your work before you leave on Friday.": "メンテナンスのため、土曜9時から13時までWi-Fiが停止します。金曜の退社前に作業を保存してください。",
  "Meals under $30 do not need a receipt. Anything above must be submitted with a photo of the receipt within one week.": "30ドル未満の食事にレシートは不要です。それを超える場合は、1週間以内にレシートの写真を添えて提出してください。",
  "Room A holds 12 people and has a screen. Room B holds 6 and does not. Book through the shared calendar at least one day ahead.": "Room Aは12人収容でスクリーンがあります。Room Bは6人でスクリーンはありません。共有カレンダーから遅くとも前日までに予約してください。",
  "Mr. Brown called while you were out. He asks you to call him back before five today.": "外出中にブラウンさんから電話がありました。今日5時までに折り返してほしいとのことです。",
  "Please remember that the office will close early on Friday. All staff should leave by three.": "金曜はオフィスが早く閉まりますのでご注意ください。全社員3時までに退社してください。",
  "Just to confirm, we meet at ten in room B, and Sarah will bring the printed handouts.": "確認ですが、10時にRoom Bで集合し、サラが印刷した資料を持ってきます。",

  /* business plus */
  "I agree with the idea in principle, but the timing worries me. Could we start after the audit instead?": "考え自体には基本的に賛成ですが、時期が気になります。代わりに監査の後に始められませんか。",
  "We can't lower the price, but we could extend the payment period to 60 days.": "価格を下げることはできませんが、支払い期間を60日に延ばすことは可能です。",
  "We came in ten percent under target, mainly due to the delayed launch. Next month we will focus on the enterprise segment.": "主にローンチの遅れにより、目標を10%下回りました。来月は法人部門に注力します。",
  "We are sorry to inform you that delivery will be delayed by one week due to a parts shortage. The new date is June 14, and we will cover the shipping cost.": "申し訳ありませんが、部品不足により納品が1週間遅れます。新しい納期は6月14日で、送料は当社が負担します。",
  "We currently track the same tasks in two tools, which costs us about three hours a week. I suggest we move everything to one system by the end of the quarter.": "現在、同じ作業を2つのツールで管理しており、週に約3時間を無駄にしています。四半期末までに一つのシステムに統合することを提案します。",
  "Due to rising material costs, we will need to raise our prices by 5% from the next term. We have kept the increase as small as possible.": "原材料費の高騰により、来期から価格を5%引き上げる必要があります。値上げ幅はできる限り小さく抑えました。",
  "Self-reviews are due March 1. Manager reviews follow by March 15, and final ratings are shared in the first week of April.": "自己評価の締切は3月1日です。上司評価は3月15日までに続き、最終評価は4月の第1週に共有されます。",
  "Either party may end this agreement with 60 days' written notice. Early termination without notice incurs a fee equal to three months of service.": "いずれの当事者も、60日前の書面通知により本契約を終了できます。通知なしの早期解約には、3か月分のサービス料に相当する費用が発生します。",
  "Online sales rose 22% while store sales fell 8%. The overall gain was modest because stores still account for two thirds of revenue.": "オンライン売上は22%増、店舗売上は8%減でした。店舗が依然として売上の3分の2を占めるため、全体の伸びは小幅にとどまりました。",
  "Revenue grew by twelve percent this quarter, but costs rose as well, so profit stayed almost flat.": "今四半期の売上は12%伸びましたが、費用も増えたため、利益はほぼ横ばいでした。",
  "We are short one designer for the June launch. I suggest we move Kate from the internal project for six weeks.": "6月のローンチに向けてデザイナーが1人足りません。ケイトを社内プロジェクトから6週間移すことを提案します。",
  "They liked the proposal overall, but they want the price broken down by phase before they sign.": "先方は提案を全体的に気に入っていますが、契約前に価格を段階別に分けてほしいとのことです。",

  /* study basic */
  "Sorry, could you explain that part again? I didn't quite follow.": "すみません、その部分をもう一度説明していただけますか。うまく理解できませんでした。",
  "Shall we decide who does what first? I can take the research part.": "まず誰が何をするか決めませんか。私は調査の部分を担当できます。",
  "I'm not feeling well, so I can't come to class tomorrow. Should I send the assignment by email?": "体調が良くないので、明日の授業に行けません。課題はメールで送るべきでしょうか。",
  "Could I visit your office hours on Thursday to discuss my report? I have two questions about the sources.": "レポートの相談で、木曜のオフィスアワーに伺ってもよいでしょうか。出典について2つ質問があります。",
  "How about meeting at the library at four on Friday? Please let me know if that doesn't work.": "金曜の4時に図書館で集まるのはどうですか。都合が悪ければ教えてください。",
  "The article argues that short daily study beats long weekend sessions. The author supports this with a study of 200 students.": "この記事は、毎日の短い学習が週末のまとめ学習に勝ると主張しています。著者は200人の学生を対象とした研究でこれを裏づけています。",
  "Attendance counts for 10% of the grade. Students who miss more than four classes cannot pass, regardless of test scores.": "出席は成績の10%を占めます。5回以上欠席した学生は、テストの点数に関わらず合格できません。",
  "Books may be borrowed for two weeks and renewed once online. Renewals are not possible if another student has reserved the book.": "本は2週間借りられ、オンラインで1回延長できます。他の学生が予約している場合、延長はできません。",
  "Write 800 to 1,000 words. Include at least three academic sources. Wikipedia may be used to find sources but not cited directly.": "800〜1000語で書いてください。学術的な出典を少なくとも3つ含めること。Wikipediaは出典を探すのに使えますが、直接引用はできません。",
  "Next week's class will be online. The link will be posted on the course page on Monday morning.": "来週の授業はオンラインです。リンクは月曜の朝に授業ページに掲載されます。",
  "Your essay is due on Friday at noon. Late work loses five percent for each day.": "エッセイの締切は金曜の正午です。遅れた提出物は1日につき5%減点されます。",
  "Before you start, put on your safety glasses and read the whole procedure once.": "始める前に、保護メガネを着けて、手順全体を一度読んでください。",

  /* study plus */
  "I think remote classes work for lectures but not for labs. In our own survey, lab scores dropped by fifteen percent online.": "オンライン授業は講義には向くが実験には向かないと思います。私たち自身の調査では、オンラインで実験の成績が15%下がりました。",
  "That's a good question. I don't have the data with me, but I can check it and email you by Friday.": "良い質問です。今データを持ち合わせていませんが、確認して金曜までにメールでお送りできます。",
  "I'm studying how sleep affects vocabulary retention. I'll test forty students over four weeks, half with a fixed sleep schedule.": "私は睡眠が語彙の定着にどう影響するかを研究しています。40人の学生を4週間にわたり調べ、半数は睡眠時間を固定します。",
  "This study asks whether spaced review improves long-term retention more than massed review. Sixty learners will study the same 100 words under two schedules for six weeks. We expect the spaced group to retain significantly more words.": "本研究は、間隔をあけた復習が集中的な復習より長期の定着を高めるかを問うものです。60人の学習者が同じ100語を2つの計画で6週間学習します。間隔をあけた群の方が有意に多くの語を保持すると予想します。",
  "Critics argue that online degrees lack networking value, and this is partly true. However, structured virtual cohorts now produce contact networks comparable to those of campus programs.": "批判する人は、オンライン学位には人脈の価値が欠けると論じ、それは部分的に正しいです。しかし、構造化されたオンラインの同期集団は今や、通学課程に匹敵する人脈を生み出しています。",
  "The data did not follow a normal distribution, so the planned test may not be appropriate. Would you agree to a different method instead?": "データが正規分布に従わなかったため、予定していた検定は適切でないかもしれません。代わりに別の手法にすることをご承諾いただけますか。",
  "Studies involving human participants require ethics approval before any data is collected. Approval typically takes four weeks and cannot be granted retroactively.": "人を対象とする研究は、データ収集の前に倫理承認が必要です。承認には通常4週間かかり、遡って与えられることはありません。",
  "While earlier work linked screen time to poor sleep, this study finds the effect disappears once bedtime is held constant, suggesting timing rather than screens is the key factor.": "初期の研究は画面時間と睡眠の質の低下を結びつけましたが、本研究では就寝時刻を一定にすると影響が消えることが分かり、画面よりも時刻が鍵となる要因であることを示唆しています。",
  "Applicants must maintain a 3.2 GPA and complete 20 hours of community service each term. Failure in either requirement suspends funding for the following term.": "応募者は3.2のGPAを維持し、毎学期20時間の奉仕活動を修了する必要があります。どちらかを満たせない場合、翌学期の支給が停止されます。",
  "Today's main point is simple: correlation tells us two things move together, but it never proves one causes the other.": "今日の要点は単純です。相関は2つのものが一緒に動くことを示しますが、一方が他方の原因だと証明することは決してありません。",
  "Each of you will present for ten minutes, followed by five minutes of questions from the group.": "皆さん一人ずつ10分間発表し、その後グループから5分間の質問を受けます。",
  "Your method section was clear, but the sample was too small to support such a strong conclusion.": "方法の項は明確でしたが、そこまで強い結論を支えるには標本が小さすぎました。",

  /* exam basic */
  "There are two children playing with a ball in a park. It looks like a sunny afternoon.": "公園でボールで遊んでいる子どもが2人います。晴れた午後のようです。",
  "I prefer studying in the morning because my mind is clearer then.": "私は朝に勉強する方が好きです。その方が頭がすっきりしているからです。",
  "I usually get up at six. I have coffee and check the news. Then I leave home at seven thirty.": "私はたいてい6時に起きます。コーヒーを飲んでニュースを確認します。そして7時半に家を出ます。",
  "I am against school uniforms because students should learn to choose for themselves.": "私は制服に反対です。生徒は自分で選ぶことを学ぶべきだからです。",
  "The number of users doubled between 2010 and 2020.": "利用者数は2010年から2020年の間に2倍になりました。",
  "Thank you for the invitation. I can come on Saturday. Is there anything I should bring?": "招待をありがとう。土曜に行けます。何か持っていくものはありますか。",
  "Bamboo is not a tree but a grass. Some kinds can grow almost one metre in a single day.": "竹は木ではなく草です。種類によっては1日でほぼ1メートル伸びることがあります。",
  "Buy two shirts and get the third free. The offer ends Sunday and cannot be combined with other discounts.": "シャツを2枚買うと3枚目が無料です。この特典は日曜までで、他の割引とは併用できません。",
  "The swimming pool will be closed for cleaning on Tuesday morning and will reopen at 1 p.m.": "プールは火曜の午前中、清掃のため閉鎖し、13時に再開します。",
  "Please write your name at the top of the page and do not turn it over until I say so.": "用紙の上部に名前を書き、指示があるまで裏返さないでください。",
  "It will be cloudy in the morning with rain in the afternoon. The temperature will reach eighteen degrees.": "午前は曇りで、午後は雨になるでしょう。気温は18度まで上がります。",
  "The store will close in fifteen minutes. Please bring your items to the counter.": "当店はあと15分で閉店します。お買い上げの品はレジまでお持ちください。",

  /* exam plus */
  "Remote work saves commuting time and helps focus, but it weakens informal learning between colleagues. On balance, I support a hybrid model.": "リモートワークは通勤時間を節約し集中を助けますが、同僚同士の非公式な学びを弱めます。総合的には、私はハイブリッド型を支持します。",
  "City A gets most of its rain in summer, while City B is fairly even all year. The annual totals, however, are almost the same.": "都市Aは雨の大半が夏に降りますが、都市Bは一年を通してほぼ均等です。しかし年間の合計はほとんど同じです。",
  "If I had a free year, I would work abroad rather than travel, because living somewhere teaches you far more than visiting it.": "もし1年自由になるなら、旅行するより海外で働きます。ある場所に住むことは、訪れるよりはるかに多くを教えてくれるからです。",
  "Examinations remain the standard way to measure learning, yet they capture only what can be recalled under pressure. This essay argues that continuous assessment gives a fairer picture of ability.": "試験は学習を測る標準的な方法であり続けていますが、緊張下で思い出せることしか捉えられません。本稿は、継続的な評価の方が能力をより公平に映し出すと論じます。",
  "The reading claims that four-day weeks reduce output. The lecture disputes this, citing trials in which weekly output held steady while sick leave fell by a third.": "読解文は週4日勤務が生産量を減らすと主張しています。講義はこれに異を唱え、週の生産量が横ばいを保ちつつ病欠が3分の1減った試験導入を挙げています。",
  "Between 2015 and 2025, renewables climbed from 12% to 34%, coal halved to 18%, and gas remained the largest source at around 40%.": "2015年から2025年の間に、再生可能エネルギーは12%から34%に上昇し、石炭は半減して18%になり、ガスは約40%で最大の供給源のままでした。",
  "Supporters of nuclear power point to its low emissions, but the debate has shifted: the binding constraint is no longer safety or carbon, but the decade it takes to build a plant.": "原子力の支持者は排出量の少なさを挙げますが、議論は移り変わりました。制約となっているのはもはや安全性でも炭素でもなく、発電所の建設にかかる10年という歳月です。",
  "The trial showed clear benefits, but participants were volunteers aged 20 to 30 from a single city, so the findings may not extend to older or rural populations.": "その試験は明確な効果を示しましたが、参加者は一つの都市の20〜30歳の志願者だったため、結果はより高齢の人々や地方の人々には当てはまらないかもしれません。",
  "Whereas the first survey asked how people felt about the policy, the second measured what they actually did. The gap between the two is the point of interest.": "1つ目の調査が政策についてどう感じるかを尋ねたのに対し、2つ目は実際に何をしたかを測りました。両者の差こそが着目点です。",
  "Today we will look at why some languages have many words for a single idea, and what that tells us about culture.": "今日は、なぜ一部の言語には一つの概念に多くの語があるのか、そしてそれが文化について何を語るのかを見ていきます。",
  "The team followed one thousand people for ten years, recording their diet, exercise, and sleep every six months.": "研究チームは1000人を10年間追跡し、半年ごとに食事・運動・睡眠を記録しました。",
  "I accept that the cost is high. What I question is whether the alternative would actually be any cheaper.": "費用が高いことは認めます。私が疑問に思うのは、代替案が実際に少しでも安くなるのかという点です。",

  /* daily basic */
  "What are you doing this weekend? I'm thinking of going to the new bakery.": "今週末は何をするの？私は新しいパン屋に行こうかと思ってるんだ。",
  "I love your new haircut! It really suits you.": "新しい髪型いいね！すごく似合ってるよ。",
  "Thanks for asking, but I'm pretty tired tonight. Can we do it another time?": "誘ってくれてありがとう、でも今夜はかなり疲れてるんだ。また今度でもいい？",
  "Congratulations on the new job! You worked so hard for this. Let's celebrate soon.": "新しい仕事おめでとう！本当に頑張ったもんね。近いうちにお祝いしよう。",
  "Would you mind feeding my cat while I'm away next week? I'll leave the food and a key.": "来週留守の間、猫にごはんをあげてもらえないかな。ごはんと鍵は置いておくね。",
  "I started running twice a week last month. It's hard, but I sleep so much better now.": "先月から週2回走り始めたんだ。きついけど、今はずっとよく眠れるよ。",
  "I've left your book on the kitchen table. The keys are with the neighbour, and the plants need water on Wednesday.": "あなたの本はキッチンのテーブルに置いておきました。鍵は隣の人が持っていて、植物は水曜に水やりが必要です。",
  "The picnic starts at 11. Bring one dish to share. If it rains, we'll move to Mia's flat instead.": "ピクニックは11時開始です。分け合える料理を1品持ってきてください。雨の場合は代わりにミアの部屋に移ります。",
  "Sorry everyone, I'm stuck at work and will be about an hour late. Please start without me and save me a seat.": "みんなごめん、仕事が抜けられなくて1時間ほど遅れます。先に始めて、席を取っておいてください。",
  "Hi, it's me. I'm running late, so let's meet at seven instead of six thirty. Sorry about that.": "もしもし、私です。遅れているので、6時半ではなく7時に会いましょう。ごめんなさい。",
  "So that's one large latte and a slice of carrot cake. Would you like it to eat in or take away?": "ラテのLサイズ1つとキャロットケーキ1切れですね。店内でお召し上がりですか、お持ち帰りですか。",
  "They're fixing the road tomorrow, so it might be noisy from early in the morning.": "明日は道路の工事があるので、朝早くからうるさいかもしれません。",

  /* daily plus */
  "I hate to bring this up, but do you remember the money from last month? No rush, I just wanted to mention it.": "こんな話を持ち出すのは気が引けるんだけど、先月のお金のこと覚えてる？急がなくていいよ、ただ伝えておきたかっただけ。",
  "I see why you feel that way, and you might be right. For me though, the timing just doesn't feel right yet.": "そう感じる理由は分かるし、君が正しいかもしれない。ただ僕にとっては、まだ時期がしっくりこないんだ。",
  "I once missed a flight because I trusted the wrong timetable. Since then I always check twice and arrive early.": "以前、間違った時刻表を信じて飛行機に乗り遅れたことがあります。それ以来、必ず2回確認して早めに着くようにしています。",
  "I'm really sorry about yesterday. I mixed up the dates and completely forgot. Let me make it up to you with dinner this week.": "昨日は本当にごめん。日にちを取り違えて、すっかり忘れていました。今週、夕食で埋め合わせさせて。",
  "That sounds exhausting, and anyone would feel low after a week like that. I'm free Saturday if you want to talk.": "それは疲れるね、あんな一週間の後なら誰だって落ち込むよ。話したければ土曜は空いてるよ。",
  "It's been ages! I changed teams in April, which was stressful at first but suits me much better now. We also moved to a smaller place near the river. How have you been?": "久しぶり！4月にチームを変わって、最初は大変だったけど今はずっと合っています。川の近くの小さい家にも引っ越しました。あなたはどうしてる？",
  "I'm not saying I don't want to go. I just think a whole weekend with twelve people might be a lot for me right now.": "行きたくないと言っているわけじゃないんだ。ただ、12人と週末まるごと過ごすのは、今の自分にはちょっと多いかなと思って。",
  "The food was genuinely excellent, and I'd go back for that alone. That said, we waited fifty minutes for a table despite booking, which soured the evening.": "料理は本当に素晴らしく、それだけのためにまた行きたいくらいです。とはいえ、予約したのに席まで50分待たされ、その夜の気分は台無しになりました。",
  "Three months into living alone: the silence still catches me off guard some evenings, but I've stopped dreading it. Small win.": "一人暮らし3か月。夜によっては静けさに不意を突かれるけれど、それを恐れることはなくなった。小さな前進。",
  "I don't know what to do. The job pays better, but I'd have to move away from everyone I know.": "どうしたらいいか分からない。その仕事の方が給料は良いけど、知り合い全員から離れて引っ越さないといけないんだ。",
  "We got completely lost that night, ended up at a tiny festival, and somehow it became the best part of the trip.": "あの夜は完全に道に迷って、小さなお祭りにたどり着いて、なぜかそれが旅で一番の思い出になったんだ。",
  "I could do Thursday evening, or any time Sunday. Whatever is easier for you, honestly.": "木曜の夜か、日曜ならいつでも大丈夫です。正直、あなたの都合の良い方で構いません。"
};
