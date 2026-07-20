"use strict";

/* ---------- 基本定義 ---------- */

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const SKILLS = ["speaking", "writing", "reading", "listening"];
const UNITS = ["vocab", ...SKILLS];
const DIAG_ANSWERS = { vocab: "b", grammar: "b" };
const VOCAB_DAILY = 10;
const SRS_INTERVALS = [0, 1, 2, 4, 7, 15]; // box(1-5) -> 次回までの日数

const goalMeta = {
  travel: { label: "旅行・海外生活", focus: "質問力と聞き返し" },
  business: { label: "仕事・会議", focus: "要件確認と合意形成" },
  study: { label: "留学・授業", focus: "説明理解と意見表明" },
  exam: { label: "試験・資格", focus: "正確性と時間配分" },
  daily: { label: "日常会話", focus: "自然な反応と雑談" }
};

/* ---------- 課題プール（目的 × 難度 × 技能 × 3課題） ----------
   t: タイトル / p: 指示 / x: 読解パッセージ / s: リスニング音声スクリプト
   m: 模範解答 / k: キーフレーズ（小文字） */

const taskPools = {
  travel: {
    basic: {
      speaking: [
        { t: "乗り継ぎゲートを尋ねる", p: "空港のスタッフに、乗り継ぎゲートの場所を丁寧に尋ねてください。", m: "Excuse me, could you tell me where the transfer gate is?", k: ["excuse me", "could you", "gate"] },
        { t: "レストランで注文する", p: "チキンサンドとコーヒーを丁寧に注文してください。", m: "Could I have the chicken sandwich and a coffee, please?", k: ["could i have", "please"] },
        { t: "駅への道を尋ねる", p: "通行人に、ここから駅への行き方を尋ねてください。", m: "Excuse me, how can I get to the station from here?", k: ["excuse me", "how can i get", "station"] }
      ],
      writing: [
        { t: "ホテルに依頼メール", p: "遅いチェックイン（23時ごろ）と静かな部屋をお願いする短いメールを書いてください。", m: "Hello, I have a reservation for tomorrow. Could we check in late, around 11 p.m.? We would also like a quiet room. Thank you.", k: ["check in", "could", "thank"] },
        { t: "忘れ物の問い合わせ", p: "昨日802号室にジャケットを忘れたかもしれません。確認をお願いするメッセージを書いてください。", m: "Hello, I think I left my jacket in room 802 yesterday. Could you check and let me know? Thank you.", k: ["left my", "could you", "thank"] },
        { t: "タクシーの手配", p: "明日朝9時に空港行きのタクシーをフロントに頼むメッセージを書いてください。部屋番号は502です。", m: "Hi, could you book a taxi to the airport for 9 a.m. tomorrow? My room number is 502.", k: ["could you", "taxi", "tomorrow"] }
      ],
      reading: [
        { t: "駅の掲示を読む", x: "The 9:15 train to Boston is delayed by 20 minutes. Passengers for New York, please transfer at Central Station, platform 4.", p: "何分遅れで、どこで乗り換えるべきか、英語1〜2文でまとめてください。", m: "The train is delayed by 20 minutes, and I should transfer at Central Station on platform 4.", k: ["20 minutes", "central station", "platform 4"] },
        { t: "ホテルの案内を読む", x: "Breakfast is served from 6:30 to 10:00 on the 2nd floor. The pool is closed on Mondays.", p: "朝食とプールについて分かったことを英語でまとめてください。", m: "Breakfast is on the second floor from 6:30 to 10:00, and the pool is closed on Mondays.", k: ["6:30", "second floor", "monday"] },
        { t: "空港の標識を読む", x: "Passengers with connecting flights should proceed to Gate B12. Please have your boarding pass ready.", p: "自分が何をすべきか、英語1文で書いてください。", m: "I should go to Gate B12 and have my boarding pass ready.", k: ["b12", "boarding pass"] }
      ],
      listening: [
        { t: "搭乗アナウンス", s: "Attention passengers. Flight 208 to Chicago is now boarding at gate 15." },
        { t: "ホテルのフロント", s: "Welcome to City Hotel. Your room is on the fifth floor. Here is your key." },
        { t: "車内アナウンス", s: "The next stop is Central Station. Please change here for the airport line." }
      ]
    },
    plus: {
      speaking: [
        { t: "欠航便の交渉", p: "フライトが欠航になりました。次の便への振替を依頼し、明朝までに到着したい事情も伝えてください。", m: "My flight was canceled. Could you rebook me on the next available flight? I need to arrive by tomorrow morning.", k: ["canceled", "rebook", "next"] },
        { t: "部屋の不具合を伝える", p: "エアコンが動きません。修理か部屋の変更を丁寧に依頼してください。", m: "I'm afraid the air conditioner in my room isn't working. Could you send someone to fix it, or move me to another room?", k: ["afraid", "working", "another room"] },
        { t: "現地の人に聞く", p: "初めて来た街で、1日しかない場合のおすすめを尋ねてください。", m: "This is my first time here. What do you recommend seeing if I only have one day?", k: ["first time", "recommend", "one day"] }
      ],
      writing: [
        { t: "返金依頼メール", p: "5月3日のツアーが悪天候で中止に。予約番号5024の返金方法を尋ねるメールを書いてください。", m: "Hello, my tour on May 3 was canceled due to the weather. Could you tell me how to get a refund? My booking number is 5024. Thank you.", k: ["refund", "booking", "canceled"] },
        { t: "宿のホストへ質問", p: "到着は22時ごろ。レイトチェックインの可否と、近くに駐車場があるか尋ねてください。", m: "Hi, we will arrive around 10 p.m. Is late check-in possible? Also, is there parking near the apartment?", k: ["arrive", "late check-in", "parking"] },
        { t: "宿泊レビューを書く", p: "立地とスタッフは良かったが部屋は写真より狭かった、それでもまた泊まりたい、というレビューを書いてください。", m: "The location was perfect and the staff were friendly. However, the room was smaller than the photos. Overall, I would stay here again.", k: ["however", "overall", "would"] }
      ],
      reading: [
        { t: "運休のお知らせ", x: "Due to a strike, all trains on the Blue Line are suspended this weekend. Replacement buses run every 30 minutes from the main square, but expect delays of up to one hour.", p: "自分の移動プランをどう変えるべきか、英語でまとめてください。", m: "Trains on the Blue Line are suspended, so I should take a replacement bus from the main square and allow up to an extra hour.", k: ["suspended", "bus", "hour"] },
        { t: "旅行保険の注意書き", x: "This policy covers medical costs up to $50,000 but does not cover lost baggage unless it was checked in.", p: "この保険で何がカバーされ、何が条件付きか、英語でまとめてください。", m: "Medical costs are covered up to $50,000, but lost baggage is only covered if it was checked in.", k: ["50,000", "baggage", "checked"] },
        { t: "免税のルール", x: "Visitors may claim a tax refund on purchases over $100 made at participating stores. Keep your receipts and show them at the airport counter before check-in.", p: "免税を受けるために自分がすべきことを英語でまとめてください。", m: "I can get a tax refund on purchases over $100 if I keep my receipts and show them at the airport before check-in.", k: ["refund", "100", "receipts"] }
      ],
      listening: [
        { t: "バスの経路変更", s: "Ladies and gentlemen, due to heavy traffic, this bus will take a different route. If you need City Museum, please get off at the next stop." },
        { t: "アップグレードの案内", s: "Your room upgrade is confirmed. Breakfast and pool access are included at no extra charge." },
        { t: "終電のアナウンス", s: "The last train to the airport leaves at eleven forty from platform two. Please do not miss it." }
      ]
    }
  },
  business: {
    basic: {
      speaking: [
        { t: "締切と担当を確認する", p: "会議の最後に、締切が金曜で合っているか、レポート担当は誰かを確認してください。", m: "Just to confirm, the deadline is Friday, right? Who is in charge of the report?", k: ["confirm", "deadline", "who"] },
        { t: "はじめての自己紹介", p: "営業チームのケンとして、担当エリアを添えて自己紹介してください。", m: "Hello, I'm Ken from the sales team. I'm in charge of the Tokyo area. Nice to meet you.", k: ["i'm", "in charge", "nice to meet"] },
        { t: "丁寧に聞き返す", p: "相手の説明が速すぎました。もう一度ゆっくり言ってもらうよう頼んでください。", m: "Sorry, could you say that again more slowly? I want to make sure I understand.", k: ["sorry", "again", "make sure"] }
      ],
      writing: [
        { t: "会議の欠席連絡", p: "明日の会議をクライアント訪問のため欠席する連絡と、議事録の共有依頼を書いてください。", m: "Hello, I'm afraid I can't join tomorrow's meeting because of a client visit. Could you share the notes later? Thank you.", k: ["afraid", "join", "could you"] },
        { t: "資料の送付メール", p: "売上レポートを添付して送るときの短いメールを書いてください。", m: "Hi, please find the sales report attached. Let me know if you have any questions.", k: ["attached", "let me know"] },
        { t: "打ち合わせの日程調整", p: "火曜14時を提案し、ダメなら木曜午前も空いていると伝える返信を書いてください。", m: "Thank you for your email. How about Tuesday at 2 p.m.? If that doesn't work, I'm also free on Thursday morning.", k: ["how about", "work", "free"] }
      ],
      reading: [
        { t: "予定変更のメモ", x: "Team, the client moved our demo from May 10 to May 8. Please finish the slides by May 6 and send them to Anna for review.", p: "新しい締切と提出先を英語でまとめてください。", m: "The demo is now on May 8, so the slides are due May 6 and should go to Anna.", k: ["may 8", "may 6", "anna"] },
        { t: "経費ルールの変更", x: "Starting next month, all expense reports must be submitted online by the 25th. Paper forms will no longer be accepted.", p: "何がどう変わるのか、英語でまとめてください。", m: "From next month, expense reports must be submitted online by the 25th, and paper forms won't be accepted.", k: ["online", "25th", "paper"] },
        { t: "オフィス閉鎖の連絡", x: "The office will be closed on Friday for maintenance. Please work from home and keep Slack open during business hours.", p: "金曜に自分がすべきことを英語でまとめてください。", m: "The office is closed on Friday, so we should work from home and stay available on Slack.", k: ["friday", "home", "slack"] }
      ],
      listening: [
        { t: "会議の冒頭", s: "Let's start the meeting. First, a quick update on the schedule. The release date moves to next Wednesday." },
        { t: "画面共有の確認", s: "Can everyone see my screen? Today I want to talk about the budget for the next quarter." },
        { t: "会議のまとめ", s: "Thanks everyone. To sum up, John will contact the client, and we will meet again on Friday." }
      ]
    },
    plus: {
      speaking: [
        { t: "懸念を伝えて代案を出す", p: "相手の案に一定の理解を示しつつ、コスト面の懸念を伝え、2案の比較を提案してください。", m: "I see your point, but I'm concerned about the cost. Could we compare two options before deciding?", k: ["your point", "concerned", "options"] },
        { t: "スケジュール変更を提案", p: "ローンチを6月に延ばす提案と、その利点（テスト期間が2週間増える）を伝えてください。", m: "I'd like to suggest moving the launch to June. That would give us two more weeks for testing.", k: ["suggest", "would give", "testing"] },
        { t: "進捗を報告する", p: "全体は順調、開発は80%完了、ただし人員不足でテストがやや遅れ、と報告してください。", m: "We're on track overall. Development is 80 percent done, but testing is slightly behind because of a staffing issue.", k: ["on track", "behind", "because"] }
      ],
      writing: [
        { t: "議事録メール", p: "決定事項（6月1日ローンチ）、未決事項（プレミアム価格）、次のアクション（ケンが金曜までにプレスリリース案）を含む議事録を書いてください。", m: "Hi all, here is a summary of today's meeting. Decided: we will launch on June 1. Open: pricing for the premium plan. Next steps: Ken will draft the press release by Friday.", k: ["summary", "decided", "next steps"] },
        { t: "丁寧な催促メール", p: "先週送った契約書の状況を、角を立てずに確認するメールを書いてください。", m: "I hope you're doing well. I'm writing to follow up on the contract I sent last week. Could you let me know the status when you have a moment?", k: ["follow up", "status", "moment"] },
        { t: "提案を断るメール", p: "提案への感謝を伝えつつ今回は見送ること、今後の協業に期待することを丁寧に書いてください。", m: "Thank you for the proposal. After careful consideration, we have decided not to move forward this time. We appreciate your effort and hope to work together in the future.", k: ["consideration", "move forward", "appreciate"] }
      ],
      reading: [
        { t: "契約条件を読む", x: "The new vendor offers a 15% discount for annual contracts, but the cancellation fee is high: 50% of the remaining balance. Legal suggests a 6-month pilot before committing.", p: "リスクと安全策を英語でまとめてください。", m: "The discount is attractive, but the cancellation fee is risky, so a 6-month pilot is the safer option.", k: ["discount", "cancellation", "pilot"] },
        { t: "業績レポートを読む", x: "Q2 revenue grew 8% year over year, driven by the enterprise segment. However, churn in the small-business segment rose to 6%, which may offset gains next quarter.", p: "好材料と懸念材料を英語でまとめてください。", m: "Revenue grew 8% thanks to enterprise, but rising small-business churn could offset that next quarter.", k: ["8%", "churn", "offset"] },
        { t: "セキュリティ通達を読む", x: "Following the security audit, all staff must enable two-factor authentication by March 15. Accounts without it will be suspended until IT confirms compliance.", p: "全員が何をいつまでにすべきか、しないとどうなるかを英語でまとめてください。", m: "Everyone must enable two-factor authentication by March 15 or their accounts will be suspended.", k: ["two-factor", "march 15", "suspended"] }
      ],
      listening: [
        { t: "会議での反対意見", s: "Before we close, one concern. If we cut the testing phase, support tickets may increase. I suggest we keep the original schedule." },
        { t: "価格交渉の報告", s: "The client asked for a discount. I proposed extending the contract to two years instead of lowering the price." },
        { t: "採用凍結の共有", s: "Quick update. Hiring is frozen until next quarter, so please plan the roadmap with the current team size." }
      ]
    }
  },
  study: {
    basic: {
      speaking: [
        { t: "課題について質問する", p: "教授に、課題の説明をもう一度お願いし、締切が不安だと伝えてください。", m: "Excuse me, professor. Could you explain the assignment again? I'm not sure about the deadline.", k: ["excuse me", "explain", "deadline"] },
        { t: "クラスメイトに頼む", p: "同じ授業のクラスメイトに、月曜のノートを借りられないか尋ねてください。", m: "Hi, are you also in Professor Lee's class? Could I borrow your notes from Monday?", k: ["could i borrow", "notes"] },
        { t: "図書館で本を探す", p: "司書に、探している本の場所を尋ねてください。", m: "Excuse me, I'm looking for this book. Could you tell me where I can find it?", k: ["looking for", "could you", "find"] }
      ],
      writing: [
        { t: "教授への欠席メール", p: "体調不良で今日の授業を欠席したこと、来週までに読むべきものを尋ねるメールを書いてください。", m: "Dear Professor Lee, I'm sorry, but I was sick and missed today's class. Could you tell me what I should read for next week? Thank you.", k: ["professor", "missed", "could you"] },
        { t: "短い意見文", p: "オンライン授業の利点と課題について、自分の意見を3文程度で書いてください。", m: "I think online classes are useful because we can save time. However, it is hard to ask questions. So I prefer a mix of both.", k: ["i think", "because", "however"] },
        { t: "掲示板で仲間募集", p: "コースの掲示板で、勉強会に参加したいと投稿してください。", m: "Hi everyone, I'm new to this course. I'm interested in joining a study group. Is anyone meeting this week?", k: ["new", "study group", "anyone"] }
      ],
      reading: [
        { t: "課題の要件を読む", x: "The essay is due on Friday at 5 p.m. It should be 500 words and include at least two sources. Late work loses 10% per day.", p: "課題の条件を英語でまとめてください。", m: "The 500-word essay with two sources is due Friday at 5 p.m., and late work loses 10% per day.", k: ["friday", "500", "sources"] },
        { t: "教科書の要点を読む", x: "Chapter 3 argues that habits form through repetition and reward. The author gives the example of morning exercise becoming automatic after 60 days.", p: "この章の主張を英語で要約してください。", m: "The chapter says habits form through repetition and reward, like exercise becoming automatic after 60 days.", k: ["repetition", "reward", "automatic"] },
        { t: "オフィスアワー案内", x: "Office hours are Tuesdays 2-4 p.m. Book a slot online. For quick questions, use the course forum, where TAs reply within 24 hours.", p: "質問したいとき、どんな選択肢があるか英語でまとめてください。", m: "I can book office hours on Tuesdays or ask quick questions on the forum, where TAs reply within a day.", k: ["tuesday", "forum", "24"] }
      ],
      listening: [
        { t: "授業の始まり", s: "Today we will cover chapter five. Before that, please hand in your homework from last week." },
        { t: "小テストの案内", s: "Remember, the quiz on Friday covers everything up to page ninety. Bring a pencil and your student ID." },
        { t: "グループ課題の説明", s: "For the group project, you will work in teams of four. Choose your topic by next Monday." }
      ]
    },
    plus: {
      speaking: [
        { t: "ディスカッションで反論", p: "相手の意見を認めつつ、記事のデータは逆を示していると指摘し、図2を一緒に見ようと提案してください。", m: "That's an interesting point. However, the data in the article suggests the opposite. Could we look at figure two together?", k: ["interesting point", "however", "data"] },
        { t: "プレゼンの導入", p: "再生可能エネルギーについて、背景→2案の比較→提言の順で話すと予告する導入を作ってください。", m: "Today I'm going to talk about renewable energy. First, I'll explain the background. Then I'll compare two solutions and give my recommendation.", k: ["going to talk", "first", "then"] },
        { t: "成績の付け方を確認", p: "最終成績の計算方法、特に授業参加が何割かを教授に確認してください。", m: "Could you clarify how the final grade is calculated? Specifically, how much does class participation count?", k: ["clarify", "calculated", "participation"] }
      ],
      writing: [
        { t: "主張のある段落", p: "オンライン学習の長所と短所に触れつつ、大学はどうすべきかまで書いてください。", m: "While online learning offers flexibility and lower costs, it requires strong self-discipline. Students who lack structure often fall behind. Therefore, universities should combine online content with regular in-person sessions.", k: ["while", "therefore", "in-person"] },
        { t: "研究相談のメール", p: "論文のテーマを伝え、アウトラインを添付したので今週相談する時間をもらえないか、教授に依頼してください。", m: "Dear Professor, I'm writing my paper on language learning apps. Would you have time this week to discuss my outline? I have attached a draft.", k: ["paper", "would you have time", "attached"] },
        { t: "奨学金エッセイの核", p: "自分の目標と、このプログラムでなければならない理由を3文で書いてください。", m: "Studying abroad will help me bridge my engineering background with global experience. My goal is to develop affordable water filters, and this program offers the exact lab experience I need.", k: ["goal", "experience", "program"] }
      ],
      reading: [
        { t: "研究結果を読む", x: "The study followed 2,000 students over three years. Those who slept fewer than six hours scored 12% lower on average. However, the authors note that stress, not sleep alone, may explain part of the gap.", p: "結果と、その解釈の注意点を英語でまとめてください。", m: "Students sleeping under six hours scored 12% lower, but stress may explain part of the difference.", k: ["six hours", "12%", "stress"] },
        { t: "賛否のある理論を読む", x: "Critics argue the theory ignores cultural context. Supporters respond that its core claims have been replicated in over 30 countries, though effect sizes vary widely.", p: "批判側と擁護側の主張を対比して英語でまとめてください。", m: "Critics say it ignores culture, while supporters point to replications in 30 countries with varying effect sizes.", k: ["critics", "replicated", "vary"] },
        { t: "学部の提案を読む", x: "Enrollment in humanities has fallen 25% in a decade. The dean proposes joint degrees with computer science, arguing that employers value writing plus technical skills.", p: "背景と提案を英語でまとめてください。", m: "Humanities enrollment fell 25%, so the dean proposes joint degrees with computer science to add technical skills.", k: ["25%", "joint", "computer science"] }
      ],
      listening: [
        { t: "講義の構成を聞く", s: "There are three main causes of the revolution. Economic pressure, new ideas, and a weak government. Let's start with the economy." },
        { t: "中間試験の説明", s: "Your midterm will be an open-book essay. You will have two hours, and you must cite at least three readings from class." },
        { t: "休講と代替課題", s: "Next week's seminar is canceled. Instead, please watch the recorded lecture and post one question to the forum by Thursday." }
      ]
    }
  },
  exam: {
    basic: {
      speaking: [
        { t: "1分自己紹介", p: "名前・仕事・趣味・最近始めたことを入れて、試験形式の自己紹介を作ってください。", m: "My name is Yuki. I work at a small IT company. In my free time, I enjoy running and cooking. Recently I started studying English to travel abroad.", k: ["my name", "free time", "recently"] },
        { t: "写真描写", p: "「カフェで注文する女性と、後ろに並ぶ2人」の写真を describing する解答を作ってください。", m: "In this picture, a woman is ordering coffee at a cafe. There are two people waiting behind her. It looks like a busy morning.", k: ["in this picture", "there are", "looks like"] },
        { t: "好みを理由付きで", p: "朝と夜、どちらに勉強したいかを理由と例を添えて答えてください。", m: "I prefer studying in the morning because my mind is fresh. For example, I remember words better before breakfast.", k: ["prefer", "because", "for example"] }
      ],
      writing: [
        { t: "賛否 + 理由2つ", p: "「リモートワークは生産性を上げる」に賛成か反対か、理由を2つ挙げて書いてください。", m: "I agree that remote work improves productivity. First, workers save commuting time. Second, they can focus better without office noise. Therefore, companies should allow it.", k: ["first", "second", "therefore"] },
        { t: "グラフを説明する", p: "「1〜6月で売上が増加、4月が最大の伸び、コストは横ばい」というグラフを説明してください。", m: "The graph shows that sales increased from January to June. The biggest rise was in April. In contrast, costs stayed almost the same.", k: ["shows", "increased", "in contrast"] },
        { t: "Eメール問題", p: "ワークショップへの招待に、お礼→出席の意思→持ち物の質問、の順で返信してください。", m: "Dear Mr. Smith, thank you for your invitation. I would be happy to attend the workshop on Saturday. Could you tell me what I should bring?", k: ["thank you for", "happy to", "could you"] }
      ],
      reading: [
        { t: "お知らせ問題", x: "The city library will move to a new building in September. During August, all books must be returned, and online services will pause for two weeks.", p: "いつ何が起きるかを英語でまとめてください。", m: "The library moves in September, books are due back in August, and online services stop for two weeks.", k: ["september", "august", "two weeks"] },
        { t: "手続きの読み取り", x: "To register for the exam, create an account, upload a photo, and pay the fee by June 1. Late registration costs an extra $30.", p: "期限と、遅れた場合どうなるかを英語でまとめてください。", m: "I must register and pay by June 1, or pay an extra $30 for late registration.", k: ["june 1", "extra", "30"] },
        { t: "文脈から語義推測", x: "The manager was reluctant to approve the budget, asking for more data twice before finally agreeing.", p: "reluctant の意味を、文脈から英語で説明してください。", m: "Reluctant means unwilling or hesitant to do something.", k: ["unwilling", "hesitant"] }
      ],
      listening: [
        { t: "場面推測の練習", s: "Question one. Where does the conversation probably take place? Listen carefully to words like menu, order, and bill." },
        { t: "予約変更を聞き取る", s: "The man wants to change his appointment from Tuesday to Thursday afternoon." },
        { t: "店内アナウンス", s: "Attention shoppers. All winter items are thirty percent off until Sunday." }
      ]
    },
    plus: {
      speaking: [
        { t: "45秒意見スピーチ", p: "「学生は制服を着るべきか」について、立場と理由2つで45秒スピーチの原稿を作ってください。", m: "Some people think students should wear uniforms. I disagree for two reasons. First, clothes are a form of self-expression. Second, uniforms are expensive for families. That's why I support free dress.", k: ["disagree", "first", "second"] },
        { t: "講義の要約スピーキング", p: "「都市が暑くなる理由（熱を吸収する路面・木の減少）」という講義を要約する解答を作ってください。", m: "The lecture explained why cities are getting hotter. The professor gave two examples: dark surfaces that absorb heat and fewer trees. This supports the reading's main claim.", k: ["lecture", "examples", "supports"] },
        { t: "二択で立場を選ぶ", p: "インターンと夏期講習、どちらを選ぶか仮定法を使って理由付きで答えてください。", m: "If I had to choose, I would take the internship rather than the summer course, because practical experience matters more in my field.", k: ["if i had to", "rather than", "because"] }
      ],
      writing: [
        { t: "意見エッセイの核", p: "「オンラインショッピングと地元商店」について、譲歩→主張→理由の構造で書いてください。", m: "Although online shopping is convenient, it weakens local stores. Governments should support small businesses through lower taxes, because lively shopping streets make cities safer and more attractive.", k: ["although", "should", "because"] },
        { t: "統合ライティング", p: "リーディング（2035年にEVが主流）とレクチャー（電池不足・充電網の弱さ）の関係をまとめてください。", m: "The reading claims electric cars will dominate by 2035. However, the lecture points out battery shortages and weak charging networks, which cast doubt on that timeline.", k: ["claims", "however", "doubt"] },
        { t: "2時点のグラフ比較", p: "「2000年と2020年のエネルギー源構成（石炭45%→20%、再エネ3倍、ガス25%横ばい）」を比較して書いてください。", m: "The chart compares energy sources in 2000 and 2020. Coal fell sharply from 45% to 20%, while renewables tripled. Gas remained stable at around 25%.", k: ["compares", "while", "remained"] }
      ],
      reading: [
        { t: "通説への反証を読む", x: "Paragraph 2 contradicts the common belief that multitasking saves time. In experiments, switching tasks added up to 40% more completion time, especially for complex work.", p: "筆者の主張と根拠を英語でまとめてください。", m: "Multitasking actually wastes time; switching added up to 40% more time on complex tasks.", k: ["40%", "switching", "complex"] },
        { t: "譲歩と主張を読む", x: "While the author concedes that tourism brings revenue, she maintains that unregulated growth damages the very sites tourists come to see, citing Venice as a cautionary tale.", p: "筆者が認めている点と、それでも主張している点をまとめてください。", m: "The author admits tourism earns money but argues unregulated growth destroys the attractions, using Venice as an example.", k: ["revenue", "unregulated", "venice"] },
        { t: "因果関係の罠を読む", x: "The correlation between coffee and longevity disappeared once researchers controlled for income and exercise, suggesting earlier studies confused cause and effect.", p: "この研究が示したことを英語でまとめてください。", m: "After controlling for income and exercise, the coffee-longevity link vanished, so earlier studies likely mixed up cause and effect.", k: ["controlled", "disappeared", "cause"] }
      ],
      listening: [
        { t: "主張と根拠を聞く", s: "The speaker argues that paper books will survive, mainly because readers remember more when they turn physical pages." },
        { t: "研究結果を聞く", s: "According to the study, people who wrote down three goals each morning finished twenty percent more tasks by Friday." },
        { t: "反対意見を聞く", s: "The professor disagrees with the textbook. She says the data is too old and the sample was too small to draw conclusions." }
      ]
    }
  },
  daily: {
    basic: {
      speaking: [
        { t: "週末の予定を話す", p: "友人に週末の予定を聞き、自分は新しいラーメン店に行こうと思っていると伝えてください。", m: "What are you doing this weekend? I'm thinking of trying that new ramen place.", k: ["weekend", "thinking of"] },
        { t: "相づちと深掘り", p: "旅行の話をしてくれた友人に、リアクション＋天気についての質問で返してください。", m: "Oh really? That sounds fun! How was the weather there?", k: ["really", "sounds", "how was"] },
        { t: "近況を伝える", p: "最近忙しいこと、でも日曜のジョギングを始めたことを話してください。", m: "I've been busy with work lately, but I started jogging on Sundays. It feels great.", k: ["been busy", "started", "feels"] }
      ],
      writing: [
        { t: "誘いを断って提案", p: "金曜は行けないと謝り、代わりに来週火曜を提案するチャット返信を書いてください。", m: "Sorry, I can't make it on Friday. How about next Tuesday instead? I'd love to catch up.", k: ["sorry", "make it", "how about"] },
        { t: "お礼のメッセージ", p: "昨晩の夕食のお礼と、次は自分がおごる、というメッセージを書いてください。", m: "Thank you so much for dinner last night! The pasta was amazing. Next time it's on me.", k: ["thank you", "amazing", "next time"] },
        { t: "遊びの計画を提案", p: "土曜の映画（19時の新作アクション）と、その後の夕食に誘うメッセージを書いてください。", m: "Do you want to see a movie this Saturday? There's a new action film at 7. We could grab dinner after.", k: ["do you want", "there's", "after"] }
      ],
      reading: [
        { t: "SNSの報告投稿", x: "Finally finished my first 10K run! My legs are dead but I'm so proud. Next goal: half marathon in October.", p: "投稿者の気持ちと次の目標を英語でまとめてください。", m: "They finished their first 10K, feel proud though tired, and now aim for a half marathon in October.", k: ["10k", "proud", "october"] },
        { t: "友達からの連絡", x: "Hey, party's moved to Sam's place, same time. Bring something to drink. Oh, and it's a surprise, so don't text Alex!", p: "変更点と注意点を英語でまとめてください。", m: "The party is now at Sam's place at the same time; bring drinks and keep it secret from Alex.", k: ["sam", "drink", "alex"] },
        { t: "カフェのレビュー", x: "New cafe alert: great flat white, quiet upstairs seating, free wifi. A bit pricey though. Perfect for remote work days.", p: "このカフェの長所と短所を英語でまとめてください。", m: "The new cafe has good coffee, quiet seats, and wifi, but it's a little expensive.", k: ["quiet", "wifi", "pricey"] }
      ],
      listening: [
        { t: "待ち合わせの一言", s: "Hey, sorry I'm late. The train stopped for ten minutes. Did you order already?" },
        { t: "バーベキューの誘い", s: "I'm planning a small barbecue on Saturday. Can you bring some drinks? Around three o'clock." },
        { t: "コンサートの誘い", s: "Guess what? I got two tickets for the concert. Are you free next Friday night?" }
      ]
    },
    plus: {
      speaking: [
        { t: "ドラマの感想を語る", p: "話題のドラマについて、正直な感想（1期の方が良かったけどハマってる）を話してください。", m: "I've been watching that new drama everyone talks about. Honestly, the first season was better, but I'm still hooked.", k: ["honestly", "better", "still"] },
        { t: "相談に乗る", p: "仕事の悩みを打ち明けた友人に、共感→提案→味方だと伝える、の順で返してください。", m: "That sounds tough. Have you thought about talking to your manager directly? Whatever you decide, I'm on your side.", k: ["sounds tough", "have you thought", "your side"] },
        { t: "思い出話をする", p: "道に迷った末に地元の祭りにたどり着いた旅の思い出を、オチをつけて話してください。", m: "That trip was unforgettable. We got completely lost, ended up at a tiny local festival, and it turned out to be the best night.", k: ["unforgettable", "ended up", "turned out"] }
      ],
      writing: [
        { t: "久しぶりの近況メール", p: "昇進後忙しかったこと、沖縄で1週間休んだこと、相手の新居について尋ねることを含めて書いてください。", m: "It's been ages! Work has been hectic since the promotion, but I finally took a week off in Okinawa. How's the new apartment? Let's have a video call soon.", k: ["it's been", "finally", "how's"] },
        { t: "丁寧に断って代案", p: "誘いへの感謝→家庭の用事で行けない→日曜ブランチを代案（自分のおごり）の順で書いてください。", m: "I really appreciate the invite, but I have a family thing that day. Could we do brunch on Sunday instead? My treat.", k: ["appreciate", "instead", "treat"] },
        { t: "おすすめを紹介する", p: "気に入った本の流れで『Deep Work』を薦め、自分がどう変わったか、貸す約束も添えてください。", m: "If you liked that book, you should try Deep Work. It changed how I plan my mornings. I'll lend you my copy next time we meet.", k: ["you should try", "changed", "lend"] }
      ],
      reading: [
        { t: "海外移住の投稿", x: "Not gonna lie, moving abroad alone was terrifying at first. Three months in, I finally have a routine: morning market, work, evening runs by the river. Homesick? Sometimes. Regrets? Zero.", p: "投稿者の3ヶ月間の変化を英語でまとめてください。", m: "They were scared about moving abroad, but after three months they have a routine, sometimes miss home, and have no regrets.", k: ["terrifying", "routine", "regrets"] },
        { t: "グループへの連絡", x: "PSA for the group: the hiking trail we planned is closed after last week's storm. Plan B is the coastal path. Slightly longer but the views are unreal. Meet at 8 sharp.", p: "予定の変更点を英語でまとめてください。", m: "The original trail is closed, so the group will take the longer coastal path, meeting at 8.", k: ["closed", "coastal", "8"] },
        { t: "あえての逆張り投稿", x: "Hot take: brunch is overrated. You wait an hour for eggs you could make at home. Give me a quiet morning coffee and a good bakery any day.", p: "投稿者の主張と理由を英語でまとめてください。", m: "They think brunch is overrated because of the wait, preferring coffee and a bakery instead.", k: ["overrated", "wait", "coffee"] }
      ],
      listening: [
        { t: "予定外の夜の話", s: "So the movie was sold out, and we ended up at a jazz bar next door. Best accident ever. You have to come next time." },
        { t: "家族の相談ごと", s: "My sister is thinking about quitting her job to study design. I told her to build some savings first, just in case." },
        { t: "アパートの近況", s: "Long story short, the landlord finally fixed the heater, but now the kitchen tap is leaking. This apartment keeps me busy." }
      ]
    }
  }
};

/* ---------- 単語デッキ（目的別 / w: 単語, ja: 意味, ex: 例文） ---------- */

const vocabDecks = {
  travel: [
    { w: "reservation", ja: "予約", ex: "I'd like to make a reservation for two nights." },
    { w: "delay", ja: "遅延・遅れ", ex: "There is a 30-minute delay on this flight." },
    { w: "transfer", ja: "乗り換え（る）", ex: "You need to transfer at Central Station." },
    { w: "luggage", ja: "手荷物", ex: "Can I leave my luggage at the front desk?" },
    { w: "boarding pass", ja: "搭乗券", ex: "Please show your boarding pass at the gate." },
    { w: "departure", ja: "出発", ex: "The departure time has changed to 3 p.m." },
    { w: "refund", ja: "返金", ex: "Can I get a refund for this ticket?" },
    { w: "receipt", ja: "領収書・レシート", ex: "Could I have a receipt, please?" },
    { w: "directions", ja: "道順", ex: "Could you give me directions to the museum?" },
    { w: "crowded", ja: "混雑した", ex: "The market gets crowded on weekends." },
    { w: "available", ja: "空いている・利用できる", ex: "Is there a room available tonight?" },
    { w: "recommend", ja: "すすめる", ex: "What do you recommend on this menu?" },
    { w: "charge", ja: "料金・請求（する）", ex: "Is there an extra charge for breakfast?" },
    { w: "platform", ja: "（駅の）ホーム・番線", ex: "The train leaves from platform 4." },
    { w: "customs", ja: "税関", ex: "You have to go through customs first." },
    { w: "out of order", ja: "故障中", ex: "The elevator is out of order." }
  ],
  business: [
    { w: "deadline", ja: "締切", ex: "The deadline for the report is Friday." },
    { w: "attach", ja: "添付する", ex: "I will attach the file to this email." },
    { w: "confirm", ja: "確認する・確定する", ex: "Can you confirm the meeting time?" },
    { w: "proposal", ja: "提案（書）", ex: "We reviewed the proposal yesterday." },
    { w: "budget", ja: "予算", ex: "The budget for this project is limited." },
    { w: "client", ja: "顧客・取引先", ex: "The client asked for a small change." },
    { w: "postpone", ja: "延期する", ex: "Let's postpone the meeting to next week." },
    { w: "agenda", ja: "議題", ex: "The first item on the agenda is hiring." },
    { w: "in charge of", ja: "〜の担当で", ex: "She is in charge of the new campaign." },
    { w: "follow up", ja: "追って確認する", ex: "I'll follow up with the client tomorrow." },
    { w: "negotiate", ja: "交渉する", ex: "We need to negotiate a better price." },
    { w: "update", ja: "最新情報（を伝える）", ex: "Here's a quick update on the schedule." },
    { w: "estimate", ja: "見積もり（る）", ex: "Could you send us an estimate by Friday?" },
    { w: "urgent", ja: "至急の", ex: "This is urgent, so please reply today." },
    { w: "task", ja: "作業・タスク", ex: "I have three tasks left for today." },
    { w: "schedule", ja: "予定（を組む）", ex: "Let me check my schedule first." }
  ],
  study: [
    { w: "assignment", ja: "課題", ex: "The assignment is due next Monday." },
    { w: "lecture", ja: "講義", ex: "The lecture on history was interesting." },
    { w: "due", ja: "締切の・提出期限で", ex: "The essay is due on Friday." },
    { w: "submit", ja: "提出する", ex: "Please submit your homework online." },
    { w: "source", ja: "出典・情報源", ex: "You need at least two sources for the essay." },
    { w: "summary", ja: "要約", ex: "Write a short summary of chapter three." },
    { w: "argue", ja: "主張する", ex: "The author argues that sleep improves memory." },
    { w: "evidence", ja: "根拠・証拠", ex: "There is strong evidence for this theory." },
    { w: "register", ja: "登録する・履修する", ex: "I forgot to register for the class." },
    { w: "grade", ja: "成績", ex: "Participation counts for 20% of the grade." },
    { w: "outline", ja: "アウトライン・構成案", ex: "Make an outline before you start writing." },
    { w: "participate", ja: "参加する", ex: "Please participate in the discussion." },
    { w: "revise", ja: "見直す・書き直す", ex: "I revised my essay twice before submitting." },
    { w: "cite", ja: "引用する", ex: "Remember to cite all your sources." },
    { w: "research", ja: "研究・調査", ex: "Her research focuses on child language." },
    { w: "definition", ja: "定義", ex: "Check the definition in the glossary." }
  ],
  exam: [
    { w: "describe", ja: "描写する・説明する", ex: "Describe the picture in three sentences." },
    { w: "compare", ja: "比較する", ex: "Compare the two graphs briefly." },
    { w: "increase", ja: "増加（する）", ex: "Sales increased by 10% last year." },
    { w: "decrease", ja: "減少（する）", ex: "The number of visitors decreased in winter." },
    { w: "statement", ja: "記述・主張", ex: "Is the statement true or false?" },
    { w: "passage", ja: "（読解の）本文", ex: "Read the passage and answer the questions." },
    { w: "purpose", ja: "目的", ex: "What is the main purpose of this email?" },
    { w: "infer", ja: "推測する", ex: "What can you infer from the last paragraph?" },
    { w: "conclude", ja: "結論づける", ex: "The author concludes that habits matter most." },
    { w: "opinion", ja: "意見", ex: "Give your opinion with two reasons." },
    { w: "agree", ja: "賛成する", ex: "I agree with this idea for two reasons." },
    { w: "disagree", ja: "反対する", ex: "I disagree because it costs too much." },
    { w: "reason", ja: "理由", ex: "My main reason is saving time." },
    { w: "option", ja: "選択肢", ex: "Choose the best option from A to D." },
    { w: "graph", ja: "グラフ", ex: "The graph shows sales from 2010 to 2020." },
    { w: "in contrast", ja: "対照的に", ex: "In contrast, costs stayed the same." }
  ],
  daily: [
    { w: "hang out", ja: "遊ぶ・つるむ", ex: "Do you want to hang out this weekend?" },
    { w: "catch up", ja: "近況を話す", ex: "Let's catch up over coffee soon." },
    { w: "invite", ja: "誘う・招待する", ex: "Thanks for inviting me to the party." },
    { w: "favorite", ja: "お気に入りの", ex: "This is my favorite cafe in town." },
    { w: "actually", ja: "実は", ex: "Actually, I've never seen that movie." },
    { w: "kind of", ja: "ちょっと・まあまあ", ex: "I'm kind of tired today." },
    { w: "be into", ja: "〜にハマっている", ex: "I'm really into baking these days." },
    { w: "lately", ja: "最近", ex: "Have you seen any good shows lately?" },
    { w: "grab", ja: "さっと食べる・取る", ex: "Let's grab lunch before the movie." },
    { w: "look forward to", ja: "楽しみにする", ex: "I'm looking forward to seeing you!" },
    { w: "awesome", ja: "最高の", ex: "That concert was awesome!" },
    { w: "sounds good", ja: "いいね", ex: "Seven o'clock? Sounds good to me." },
    { w: "on me", ja: "私のおごりで", ex: "Dinner is on me tonight." },
    { w: "make it", ja: "都合がつく・間に合う", ex: "Sorry, I can't make it on Friday." },
    { w: "how about", ja: "〜はどう？", ex: "How about next Tuesday instead?" },
    { w: "no worries", ja: "気にしないで", ex: "No worries, we can meet another day." }
  ]
};

/* ---------- バッジ ---------- */

const badgeDefs = [
  { id: "first-task", emoji: "🎯", name: "はじめの一歩", desc: "最初の課題をクリア" },
  { id: "vocab-10", emoji: "📚", name: "ことばコレクター", desc: "単語を10語学習" },
  { id: "vocab-50", emoji: "🏆", name: "50語マスター", desc: "単語を50語学習" },
  { id: "streak-3", emoji: "🔥", name: "3日の炎", desc: "3日連続で学習" },
  { id: "streak-7", emoji: "⚡", name: "1週間の雷", desc: "7日連続で学習" },
  { id: "perfect-day", emoji: "🌟", name: "パーフェクトデー", desc: "1日で5メニュー制覇" },
  { id: "listener", emoji: "🎧", name: "ひらいた耳", desc: "ディクテーションで★3" },
  { id: "speaker", emoji: "🎙", name: "声に出した", desc: "音声入力で課題クリア" },
  { id: "rediagnosis", emoji: "📈", name: "成長チェッカー", desc: "再診断を実施" },
  { id: "level-up", emoji: "🚀", name: "レベルアップ", desc: "診断でレベルが上昇" }
];

/* ---------- 日付ユーティリティ（すべてローカル時刻基準） ---------- */

function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function keyToDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function shiftKey(key, deltaDays) {
  const date = keyToDate(key);
  date.setDate(date.getDate() + deltaDays);
  return dateKey(date);
}

function dayNumber(key) {
  return Math.round(keyToDate(key).getTime() / 86400000);
}

const todayKey = dateKey();

/* ---------- 状態管理（v2スキーマ + 旧データ移行） ---------- */

const defaultState = () => ({
  version: 2,
  goal: null,
  level: null,
  xp: 0,
  skillXp: { vocab: 0, speaking: 0, writing: 0, reading: 0, listening: 0 },
  doneDays: [],
  dayLog: {},          // { "2026-07-20": { units: ["vocab", ...] } }
  vocab: {},           // { "travel:delay": { box, due, seen } }
  wordsSeen: 0,
  history: [],         // { d, skill, task, answer, stars }
  badges: [],
  diagnoses: [],       // { d, score, level }
  settings: { weeklyGoal: 5, reminderTime: "21:00" }
});

function loadState() {
  let raw;
  try {
    raw = JSON.parse(localStorage.getItem("fluentPathState") || "{}");
  } catch {
    raw = {};
  }
  if (raw.version === 2) {
    return Object.assign(defaultState(), raw, {
      skillXp: Object.assign(defaultState().skillXp, raw.skillXp || {}),
      settings: Object.assign(defaultState().settings, raw.settings || {})
    });
  }
  // v1からの移行: XP・目的・記録日は引き継ぐ。レベルは再診断で決め直す。
  const next = defaultState();
  if (raw.goal && goalMeta[raw.goal]) next.goal = raw.goal;
  if (levels.includes(raw.level)) next.level = raw.level;
  if (Number.isFinite(raw.xp)) next.xp = Math.max(0, raw.xp);
  if (Array.isArray(raw.doneDays)) next.doneDays = raw.doneDays.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  return next;
}

let state = loadState();

function saveState() {
  localStorage.setItem("fluentPathState", JSON.stringify(state));
}

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

/* ---------- レベル / 難度 ---------- */

function getLevel(score) {
  if (score <= 3) return "A1";
  if (score <= 6) return "A2";
  if (score <= 9) return "B1";
  if (score <= 12) return "B2";
  if (score <= 14) return "C1";
  return "C2";
}

function levelIndex() {
  return Math.max(0, levels.indexOf(state.level || "A1"));
}

function tier() {
  return levelIndex() <= 1 ? "basic" : "plus";
}

function levelDescriptions(level) {
  return {
    A1: "定型文で反応",
    A2: "身近な話題",
    B1: "要点を説明",
    B2: "議論に参加",
    C1: "精密に表現",
    C2: "自在に運用"
  }[level];
}

/* ---------- 今日の課題（日替わりローテーション） ---------- */

function currentPool() {
  return taskPools[state.goal || "travel"][tier()];
}

function todaysTask(skill) {
  const pool = currentPool()[skill];
  return pool[dayNumber(todayKey) % pool.length];
}

function todayLog() {
  if (!state.dayLog[todayKey]) state.dayLog[todayKey] = { units: [] };
  return state.dayLog[todayKey];
}

function unitDone(unit) {
  return (state.dayLog[todayKey]?.units || []).includes(unit);
}

/* ---------- ストリーク（おまもり: 月1回の欠席を許容） ---------- */

function calculateStreak(days) {
  const set = new Set(days);
  const freezeUsedMonths = new Set();
  let streak = 0;
  let key = todayKey;
  if (!set.has(key)) key = shiftKey(key, -1); // 今日まだ学習していなくても昨日までの記録は生きている
  let usedFreeze = false;
  while (true) {
    if (set.has(key)) {
      streak += 1;
      key = shiftKey(key, -1);
      continue;
    }
    const month = key.slice(0, 7);
    if (streak > 0 && !freezeUsedMonths.has(month) && set.has(shiftKey(key, -1))) {
      freezeUsedMonths.add(month);
      usedFreeze = true;
      key = shiftKey(key, -1);
      continue;
    }
    break;
  }
  return { streak, usedFreeze };
}

/* ---------- 演出（トースト・紙吹雪） ---------- */

function toast(message) {
  const zone = $("#toastZone");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  zone.appendChild(el);
  setTimeout(() => el.classList.add("is-out"), 3200);
  setTimeout(() => el.remove(), 3800);
}

function celebrate(word) {
  const layer = $("#celebrateLayer");
  layer.hidden = false;
  layer.innerHTML = "";
  const powWords = ["POW!", "NICE!", "BOOM!", "WOW!", "COOL!"];
  const pow = document.createElement("span");
  pow.className = "pow-word";
  pow.textContent = word || powWords[Math.floor(Math.random() * powWords.length)];
  layer.appendChild(pow);
  const colors = ["#ff3b5c", "#ffc93c", "#28a7e9", "#23c483", "#7d5fff"];
  for (let i = 0; i < 60; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
  }
  setTimeout(() => { layer.hidden = true; layer.innerHTML = ""; }, 2600);
}

function awardBadge(id) {
  if (state.badges.includes(id)) return;
  const def = badgeDefs.find((b) => b.id === id);
  if (!def) return;
  state.badges.push(id);
  saveState();
  toast(`${def.emoji} バッジ獲得: ${def.name}`);
  celebrate();
  renderBadges();
}

/* ---------- XPと日次記録 ---------- */

function grantXp(unit, amount) {
  state.xp += amount;
  state.skillXp[unit] = (state.skillXp[unit] || 0) + amount;
}

function recordUnit(unit, xpAmount) {
  const log = todayLog();
  const firstToday = log.units.length === 0;
  const firstTimeForUnit = !log.units.includes(unit);

  if (firstTimeForUnit) {
    log.units.push(unit);
    grantXp(unit, xpAmount);
  }

  if (!state.doneDays.includes(todayKey)) {
    state.doneDays.push(todayKey);
    if (state.doneDays.length > 400) state.doneDays = state.doneDays.slice(-400);
  }

  saveState();

  const { streak } = calculateStreak(state.doneDays);
  if (firstToday) toast(`今日の学習を記録しました（${streak}日連続）`);
  if (streak >= 3) awardBadge("streak-3");
  if (streak >= 7) awardBadge("streak-7");
  if (log.units.length === UNITS.length) awardBadge("perfect-day");

  renderProgress();
  renderPlan();
  return firstTimeForUnit;
}

/* ---------- 診断 ---------- */

function handleDiagnosis(form) {
  const data = new FormData(form);
  const writing = String(data.get("writing") || "");
  const writingScore = Math.min(4, Math.floor(writing.split(/\s+/).filter(Boolean).length / 6));
  const quizScore = (data.get("vocab") === DIAG_ANSWERS.vocab ? 2 : 0) + (data.get("grammar") === DIAG_ANSWERS.grammar ? 2 : 0);
  const score = Number(data.get("confidence")) * 2 + quizScore + writingScore;

  const previousLevel = state.level;
  const isFirst = state.diagnoses.length === 0;
  state.goal = String(data.get("goal"));
  state.level = getLevel(score);
  state.diagnoses.push({ d: todayKey, score, level: state.level });
  if (state.diagnoses.length > 24) state.diagnoses = state.diagnoses.slice(-24);
  if (isFirst) state.xp += 30; // 初回診断ボーナスのみ。以降レベルとXPは独立。
  saveState();

  if (!isFirst) awardBadge("rediagnosis");
  if (previousLevel && levels.indexOf(state.level) > levels.indexOf(previousLevel)) {
    awardBadge("level-up");
    toast(`🚀 レベルアップ！ ${previousLevel} → ${state.level}`);
    celebrate("LEVEL UP!");
  } else if (previousLevel && state.level !== previousLevel) {
    toast(`診断結果: ${state.level}（前回 ${previousLevel}）`);
  } else {
    toast(`診断完了！ あなたの現在地は ${state.level} です`);
  }

  vocabSession = null;
  renderAll();
  setSkill("speaking");
  $("#plan").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- 4技能: 課題表示と採点 ---------- */

let activeSkill = "speaking";
let modelRevealed = false;
let playCount = 0;
let recognizing = false;
let usedMic = false;

function setSkill(skill) {
  activeSkill = skill;
  modelRevealed = false;
  playCount = 0;
  usedMic = false;
  const task = todaysTask(skill);
  const isListening = skill === "listening";

  $("#skillMode").textContent = skill[0].toUpperCase() + skill.slice(1);
  $("#skillTitle").textContent = task.t;
  $("#skillPrompt").textContent = isListening
    ? "▶ を押して音声を聞き、聞こえた英文をそのまま書き取ってください。（再生は何度でもOK、まずは2回で挑戦）"
    : task.p;

  const passage = $("#skillPassage");
  passage.hidden = !task.x;
  passage.textContent = task.x || "";

  $("#listenTools").hidden = !isListening;
  $("#listenCount").textContent = "";

  $("#skillAnswer").value = "";
  $("#skillAnswer").placeholder = skill === "speaking"
    ? "🎙で話すか、話す内容をタイプしてください"
    : isListening ? "聞こえた英文を書き取ってください" : "Type your answer...";
  $("#starRow").hidden = true;
  $("#modelAnswerBox").hidden = true;
  $("#micStatus").textContent = "";
  $("#feedbackText").textContent = unitDone(skill)
    ? "今日のこの課題はクリア済み。もう一度挑戦しても、明日新しい課題でもOKです。"
    : "回答を書いたらチェックできます。キーフレーズ・具体性・自然さを見ます。";
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.skill === skill));
}

function normalizeWords(text) {
  return text.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").split(/\s+/).filter(Boolean);
}

function scoreDictation(answer, script) {
  const scriptWords = normalizeWords(script);
  const answerWords = new Set(normalizeWords(answer));
  const hits = scriptWords.filter((w) => answerWords.has(w)).length;
  return scriptWords.length ? hits / scriptWords.length : 0;
}

function scoreKeyPhrases(answer, task) {
  const lower = answer.toLowerCase();
  const hits = task.k.filter((phrase) => lower.includes(phrase));
  return { ratio: task.k.length ? hits.length / task.k.length : 1, missing: task.k.filter((p) => !lower.includes(p)) };
}

function showStars(stars) {
  const row = $("#starRow");
  row.hidden = false;
  row.textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
}

function showModelAnswer(text) {
  modelRevealed = true;
  $("#modelAnswerBox").hidden = false;
  $("#modelAnswerText").textContent = text;
}

function checkAnswer() {
  const answer = $("#skillAnswer").value.trim();
  const task = todaysTask(activeSkill);

  if (!answer) {
    $("#feedbackText").textContent = activeSkill === "listening"
      ? "まず音声を再生して、聞こえた単語だけでも書いてみましょう。部分点も付きます。"
      : "まず1文だけでも入力してください。短くても、目的が伝わる文なら評価できます。";
    return;
  }

  let stars = 0;
  let message = "";

  if (activeSkill === "listening") {
    const ratio = scoreDictation(answer, task.s);
    const percent = Math.round(ratio * 100);
    stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : ratio >= 0.2 ? 1 : 0;
    message = `聞き取り一致率 ${percent}%。`;
    if (stars === 3) message += " ほぼ完璧です！";
    else if (stars === 2) message += " 骨組みは取れています。もう一度🐢でゆっくり聞いてみましょう。";
    else message += " まず数字・地名・動詞だけ拾う練習から。スクリプトを見て音と文字を結びつけましょう。";
    showModelAnswer(task.s);
  } else {
    const wordCount = normalizeWords(answer).length;
    const { ratio, missing } = scoreKeyPhrases(answer, task);
    const hasPolite = /\b(could|would|please|thank|appreciate)\b/i.test(answer);
    const advice = [];

    stars = ratio >= 0.99 ? 3 : ratio >= 0.5 ? 2 : ratio > 0 || wordCount >= 6 ? 1 : 0;
    if (tier() === "basic" && wordCount < 6) {
      advice.push("もう1つ情報を足すと、実際の場面で伝わりやすくなります。");
      stars = Math.min(stars, 1);
    }
    if (tier() === "plus" && wordCount < 15) {
      advice.push("B1以上を目指すなら、理由や補足をもう1文足してみましょう。");
      stars = Math.min(stars, 2);
    }
    if ((activeSkill === "speaking" || activeSkill === "writing") && !hasPolite && /依頼|お願い|尋ね|頼/.test(task.p)) {
      advice.push("依頼や質問では could / would / please を入れると自然です。");
    }
    if (missing.length > 0) {
      advice.push(`模範解答では ${missing.map((m) => `“${m}”`).join(", ")} のような表現が鍵になっています。`);
    }

    message = stars === 3
      ? "素晴らしい回答です。キーフレーズも情報量も揃っています。"
      : advice.join(" ") || "方向性は良いです。模範解答と見比べて、使える表現を1つ盗みましょう。";
    showModelAnswer(task.m);
  }

  showStars(stars);
  $("#feedbackText").textContent = message;

  if (stars >= 1) {
    const xp = 10 + stars * 5;
    const counted = recordUnit(activeSkill, xp);
    if (counted) {
      toast(`+${xp} XP（${$("#skillMode").textContent}）`);
      awardBadge("first-task");
      if (activeSkill === "listening" && stars === 3) awardBadge("listener");
      if (activeSkill === "speaking" && usedMic) awardBadge("speaker");
      state.history.push({ d: todayKey, skill: activeSkill, task: task.t, answer, stars });
      if (state.history.length > 200) state.history = state.history.slice(-200);
      saveState();
      renderHistory();
    } else {
      $("#feedbackText").textContent += " （今日のXPは獲得済み。練習モードです）";
    }
  }
}

/* ---------- 音声（TTS / 音声認識） ---------- */

function speak(text, rate = 0.95) {
  if (!("speechSynthesis" in window)) {
    toast("このブラウザは音声再生に対応していません");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function playListening(rate) {
  const task = todaysTask("listening");
  if (activeSkill !== "listening" || !task.s) return;
  playCount += 1;
  $("#listenCount").textContent = `再生 ${playCount}回`;
  speak(task.s, rate);
}

function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const status = $("#micStatus");
  if (!SpeechRecognition) {
    status.textContent = "このブラウザでは音声入力が使えません。英文を入力してチェックしてください。";
    return;
  }
  if (recognizing) return;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognizing = true;
  status.textContent = "🎙 聞き取り中… 英語で話してください";
  recognition.onresult = (event) => {
    usedMic = true;
    $("#skillAnswer").value = event.results[0][0].transcript;
    checkAnswer();
  };
  recognition.onerror = (event) => {
    const reasons = {
      "not-allowed": "マイクの使用が許可されていません。ブラウザの設定を確認してください。",
      "no-speech": "音声が聞き取れませんでした。もう一度試してください。",
      "audio-capture": "マイクが見つかりません。接続を確認してください。"
    };
    status.textContent = reasons[event.error] || "音声入力でエラーが起きました。入力欄にタイプしてもOKです。";
  };
  recognition.onend = () => {
    recognizing = false;
    if (status.textContent.startsWith("🎙")) status.textContent = "";
  };
  recognition.start();
}

/* ---------- 単語SRS ---------- */

let vocabSession = null; // { queue: [{id, word, isNew}], index, done, correct }

function vocabId(goal, word) {
  return `${goal}:${word.w}`;
}

function buildVocabSession() {
  const goal = state.goal || "travel";
  const deck = vocabDecks[goal];
  const due = [];
  const fresh = [];
  deck.forEach((word) => {
    const id = vocabId(goal, word);
    const entry = state.vocab[id];
    if (!entry) fresh.push({ id, word, isNew: true });
    else if (entry.due <= todayKey) due.push({ id, word, isNew: false });
  });
  // その日のノルマ達成後は、新出カードを追加せず期限が来た復習だけを出す
  const queue = unitDone("vocab") ? due.slice(0, VOCAB_DAILY) : [...due, ...fresh].slice(0, VOCAB_DAILY);
  return { queue, index: 0, correct: 0 };
}

function currentVocabCard() {
  if (!vocabSession) vocabSession = buildVocabSession();
  return vocabSession.queue[vocabSession.index] || null;
}

function renderVocab() {
  const card = currentVocabCard();
  const total = vocabSession.queue.length;
  const learned = Object.values(state.vocab).filter((v) => v.box >= 3).length;
  const dueTomorrow = Object.values(state.vocab).filter((v) => v.due === shiftKey(todayKey, 1)).length;

  $("#vocabStats").textContent = state.goal
    ? `これまでに ${state.wordsSeen} 語に出会い、${learned} 語が定着ゾーン（Box3以上）。明日の復習は ${dueTomorrow} 語です。`
    : "診断すると、目的に合った単語デッキが始まります。";

  if (!card) {
    $("#vocabProgress").textContent = `${total} / ${total}`;
    $("#vocabKind").textContent = "完了";
    $("#vocabWord").textContent = total === 0 && !unitDone("vocab") ? "今日の分は明日また" : "今日の単語はクリア！";
    $("#vocabExample").textContent = total === 0 && !unitDone("vocab")
      ? "復習期限の単語がありません。課題タブで4技能を進めましょう。"
      : "明日になると復習カードが届きます。忘れた頃が覚えどきです。";
    $("#vocabAnswer").hidden = true;
    $("#vocabRevealButton").hidden = true;
    $("#vocabKnownButton").hidden = true;
    $("#vocabAgainButton").hidden = true;
    $("#vocabSpeakButton").hidden = true;
    return;
  }

  $("#vocabProgress").textContent = `${vocabSession.index + 1} / ${total}`;
  $("#vocabKind").textContent = card.isNew ? "新しい単語" : "復習";
  $("#vocabWord").textContent = card.word.w;
  $("#vocabExample").textContent = card.word.ex;
  $("#vocabAnswer").hidden = true;
  $("#vocabAnswer").textContent = "";
  $("#vocabRevealButton").hidden = false;
  $("#vocabKnownButton").hidden = true;
  $("#vocabAgainButton").hidden = true;
  $("#vocabSpeakButton").hidden = false;
}

function revealVocab() {
  const card = currentVocabCard();
  if (!card) return;
  $("#vocabAnswer").textContent = `意味: ${card.word.ja}`;
  $("#vocabAnswer").hidden = false;
  $("#vocabRevealButton").hidden = true;
  $("#vocabKnownButton").hidden = false;
  $("#vocabAgainButton").hidden = false;
}

function gradeVocab(known) {
  const card = currentVocabCard();
  if (!card) return;
  const entry = state.vocab[card.id] || { box: 0, due: todayKey, seen: 0 };
  if (entry.seen === 0) state.wordsSeen += 1;
  entry.seen += 1;
  entry.box = known ? Math.min(5, entry.box + 1) : 1;
  entry.due = shiftKey(todayKey, SRS_INTERVALS[entry.box]);
  state.vocab[card.id] = entry;
  if (known) vocabSession.correct += 1;

  vocabSession.index += 1;
  saveState();

  if (vocabSession.index >= vocabSession.queue.length) {
    const counted = recordUnit("vocab", 20);
    if (counted) toast("+20 XP（今日の単語コンプリート！）");
    if (state.wordsSeen >= 10) awardBadge("vocab-10");
    if (state.wordsSeen >= 50) awardBadge("vocab-50");
  }
  renderVocab();
  renderProgress();
}

/* ---------- 描画 ---------- */

function renderProgress() {
  const { streak, usedFreeze } = calculateStreak(state.doneDays);
  state.streak = streak;
  $("#streakCount").textContent = streak;
  $("#freezeBadge").hidden = !usedFreeze;
  $("#xpCount").textContent = state.xp;
  $("#levelLabel").textContent = state.level || "未診断";
  $("#heroLevel").textContent = state.level || "未診断";

  const unitsDone = (state.dayLog[todayKey]?.units || []).length;
  $("#ringText").textContent = `${unitsDone}/${UNITS.length}`;
  $("#xpRing").style.strokeDashoffset = 314 - 314 * (unitsDone / UNITS.length);

  $("#heroCta").textContent = state.level ? "今日のメニューへ" : "診断を始める";
  $("#heroCta").href = state.level ? "#plan" : "#diagnostic";

  $("#levelLadder").innerHTML = levels.map((level) => `
    <div class="level-step ${level === state.level ? "is-current" : ""}">
      <strong>${level}</strong>
      <span>${levelDescriptions(level)}</span>
    </div>
  `).join("");

  renderWeek(streak);
  renderRadar();
  renderDiagChart();
}

function renderWeek(streak) {
  const doneDays = new Set(state.doneDays);
  const labels = ["月", "火", "水", "木", "金", "土", "日"];
  const now = new Date();
  const isoDay = now.getDay() || 7; // 月=1 ... 日=7
  let doneThisWeek = 0;
  $("#weekRow").innerHTML = labels.map((label, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - isoDay + index + 1);
    const key = dateKey(date);
    const isDone = doneDays.has(key);
    if (isDone) doneThisWeek += 1;
    return `<div class="day-dot ${isDone ? "is-done" : ""} ${key === todayKey ? "is-today" : ""}">${label}</div>`;
  }).join("");

  const goalDays = state.settings.weeklyGoal;
  const reached = doneThisWeek >= goalDays;
  $("#habitMessage").textContent = reached
    ? `今週の目標 ${goalDays}日 を達成！ ${doneThisWeek}日学習、連続${streak}日です。`
    : `今週 ${doneThisWeek}/${goalDays}日。課題か単語を1つ終えると、その日が自動で記録されます。`;
}

function renderRadar() {
  const svg = $("#radarChart");
  const axes = [
    ["Vocab", "vocab"], ["Speak", "speaking"], ["Write", "writing"], ["Read", "reading"], ["Listen", "listening"]
  ];
  const cx = 120; const cy = 112; const radius = 78;
  const point = (i, r) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };
  const ringPath = (r) => axes.map((_, i) => point(i, r).map((n) => n.toFixed(1)).join(",")).join(" ");
  const values = axes.map(([, key]) => Math.min(1, (state.skillXp[key] || 0) / 300));
  const valuePath = axes.map((_, i) => point(i, Math.max(0.04, values[i]) * radius).map((n) => n.toFixed(1)).join(",")).join(" ");

  svg.innerHTML = `
    ${[0.33, 0.66, 1].map((f) => `<polygon points="${ringPath(radius * f)}" class="radar-ring"></polygon>`).join("")}
    ${axes.map((_, i) => { const [x, y] = point(i, radius); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="radar-ring"></line>`; }).join("")}
    <polygon points="${valuePath}" class="radar-value"></polygon>
    ${axes.map(([label], i) => {
      const [x, y] = point(i, radius + 16);
      return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" class="radar-label">${label}</text>`;
    }).join("")}
  `;
}

function renderDiagChart() {
  const svg = $("#diagChart");
  const entries = state.diagnoses.slice(-6);
  if (entries.length === 0) {
    svg.innerHTML = `<text x="130" y="75" text-anchor="middle" class="radar-label">診断するとスコアが記録されます</text>`;
    return;
  }
  const maxScore = 16;
  const barWidth = 26;
  const gap = 14;
  const baseY = 112;
  const startX = 130 - ((entries.length * barWidth + (entries.length - 1) * gap) / 2);
  svg.innerHTML = entries.map((entry, i) => {
    const height = Math.max(6, (entry.score / maxScore) * 84);
    const x = startX + i * (barWidth + gap);
    return `
      <rect x="${x}" y="${baseY - height}" width="${barWidth}" height="${height}" rx="4" class="diag-bar"></rect>
      <text x="${x + barWidth / 2}" y="${baseY - height - 6}" text-anchor="middle" class="radar-label">${entry.level}</text>
      <text x="${x + barWidth / 2}" y="${baseY + 16}" text-anchor="middle" class="radar-label small">${entry.d.slice(5).replace("-", "/")}</text>
    `;
  }).join("");
  const latest = entries[entries.length - 1];
  const first = entries[0];
  $("#diagNote").textContent = entries.length >= 2
    ? `初回 ${first.score}点 → 最新 ${latest.score}点。2週間に1回の再診断で伸びを確かめましょう。`
    : "2週間に1回の再診断で、レベルの伸びを確かめましょう。";
}

function renderPlan() {
  const goal = goalMeta[state.goal || "travel"];
  $("#goalLabel").textContent = state.goal ? goal.label : "未設定";
  $("#recommendedLevel").textContent = state.level ? `${state.level}（${tier() === "basic" ? "基礎" : "応用"}コース）` : "診断待ち";
  $("#focusLabel").textContent = state.goal ? goal.focus : "基礎確認";

  const minutes = tier() === "plus" ? { vocab: 5, speaking: 12, writing: 15, reading: 18, listening: 10 } : { vocab: 5, speaking: 6, writing: 8, reading: 10, listening: 6 };
  const names = { vocab: "Vocab", speaking: "Speaking", writing: "Writing", reading: "Reading", listening: "Listening" };

  $("#dailyPlan").innerHTML = UNITS.map((unit) => {
    const done = unitDone(unit);
    const title = unit === "vocab" ? "今日の単語 10枚" : todaysTask(unit).t;
    const desc = unit === "vocab" ? "SRSで新出と復習をミックス。" : (unit === "listening" ? "音声を聞いて書き取るディクテーション。" : todaysTask(unit).p);
    return `
      <button type="button" class="daily-task ${done ? "is-done" : ""}" data-unit="${unit}">
        <span class="tag">${names[unit]} ${minutes[unit]}分</span>
        <strong>${done ? "✅ " : ""}${title}</strong>
        <p>${desc}</p>
      </button>
    `;
  }).join("");

  $$("#dailyPlan .daily-task").forEach((cardEl) => {
    cardEl.addEventListener("click", () => {
      const unit = cardEl.dataset.unit;
      if (unit === "vocab") {
        $("#vocab").scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setSkill(unit);
        $("#skills").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function renderBadges() {
  $("#badgeGrid").innerHTML = badgeDefs.map((badge) => {
    const owned = state.badges.includes(badge.id);
    return `
      <div class="badge ${owned ? "is-owned" : ""}" title="${badge.desc}">
        <span class="badge-emoji">${badge.emoji}</span>
        <span class="badge-name">${badge.name}</span>
      </div>
    `;
  }).join("");
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function renderHistory() {
  const items = state.history.slice(-5).reverse();
  $("#historyList").innerHTML = items.length === 0
    ? "<li class='history-empty'>課題をクリアすると、回答がここに残ります。過去の自分と見比べるのが一番の成長実感です。</li>"
    : items.map((item) => `
      <li>
        <span class="history-meta">${item.d.slice(5).replace("-", "/")} ・ ${item.skill} ・ ${"★".repeat(item.stars)}</span>
        <strong>${escapeHtml(item.task)}</strong>
        <p>${escapeHtml(item.answer)}</p>
      </li>
    `).join("");

  const first = state.history[0];
  const latest = state.history[state.history.length - 1];
  const days = first && latest ? dayNumber(latest.d) - dayNumber(first.d) : 0;
  $("#growthCompare").innerHTML = first && latest && first !== latest && days >= 1
    ? `
      <div class="compare-card">
        <span>${first.d.slice(5).replace("-", "/")} のあなた</span>
        <p>${escapeHtml(first.answer)}</p>
      </div>
      <div class="compare-arrow">→ ${days}日後</div>
      <div class="compare-card is-now">
        <span>いまのあなた</span>
        <p>${escapeHtml(latest.answer)}</p>
      </div>
    `
    : "";
}

/* ---------- 設定・データ ---------- */

function updateCalendarLink() {
  const time = ($("#reminderTime").value || "21:00").replace(":", "");
  const start = todayKey.replace(/-/g, "") + "T" + time + "00";
  const endMinutes = (Number(time.slice(0, 2)) * 60 + Number(time.slice(2)) + 20) % 1440;
  const end = todayKey.replace(/-/g, "") + "T" + String(Math.floor(endMinutes / 60)).padStart(2, "0") + String(endMinutes % 60).padStart(2, "0") + "00";
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", "英語学習 (Fluent Path)");
  url.searchParams.set("details", "今日の単語10枚と4技能課題");
  url.searchParams.set("dates", `${start}/${end}`);
  url.searchParams.set("recur", "RRULE:FREQ=DAILY");
  $("#calendarLink").href = url.toString();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fluent-path-backup-${todayKey}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("バックアップを書き出しました");
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (data.version !== 2 || typeof data.skillXp !== "object") throw new Error("invalid");
      state = Object.assign(defaultState(), data, {
        skillXp: Object.assign(defaultState().skillXp, data.skillXp || {}),
        settings: Object.assign(defaultState().settings, data.settings || {})
      });
      saveState();
      vocabSession = null;
      renderAll();
      if (state.level) setSkill(activeSkill);
      toast("データを読み込みました");
    } catch {
      toast("読み込めませんでした。Fluent Pathの書き出しファイルを選んでください。");
    }
  };
  reader.readAsText(file);
}

/* ---------- 初期化 ---------- */

function renderAll() {
  renderPlan();
  renderProgress();
  renderBadges();
  renderHistory();
  vocabSession = buildVocabSession();
  renderVocab();
  $("#weeklyGoalSelect").value = String(state.settings.weeklyGoal);
  $("#reminderTime").value = state.settings.reminderTime;
  updateCalendarLink();
}

$("#diagnosticForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handleDiagnosis(event.currentTarget);
});

$$(".tab").forEach((tab) => tab.addEventListener("click", () => setSkill(tab.dataset.skill)));
$("#checkAnswerButton").addEventListener("click", checkAnswer);
$("#speakButton").addEventListener("click", startRecognition);
$("#playAudioButton").addEventListener("click", () => playListening(0.95));
$("#playSlowButton").addEventListener("click", () => playListening(0.68));
$("#modelSpeakButton").addEventListener("click", () => {
  if (modelRevealed) speak($("#modelAnswerText").textContent);
});

$("#vocabRevealButton").addEventListener("click", revealVocab);
$("#vocabKnownButton").addEventListener("click", () => gradeVocab(true));
$("#vocabAgainButton").addEventListener("click", () => gradeVocab(false));
$("#vocabSpeakButton").addEventListener("click", () => {
  const card = currentVocabCard();
  if (card) speak(`${card.word.w}. ${card.word.ex}`);
});

$("#weeklyGoalSelect").addEventListener("change", (event) => {
  state.settings.weeklyGoal = Number(event.target.value);
  saveState();
  renderProgress();
});
$("#reminderTime").addEventListener("change", (event) => {
  state.settings.reminderTime = event.target.value;
  saveState();
  updateCalendarLink();
});
$("#exportButton").addEventListener("click", exportData);
$("#importInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) importData(file);
  event.target.value = "";
});

renderAll();
if (state.level) setSkill("speaking");
