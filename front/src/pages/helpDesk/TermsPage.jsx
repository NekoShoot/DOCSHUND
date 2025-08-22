const TermsPage = () => {
  return (
    <div className="flex justify-center w-full">
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 max-w-[1280px] mx-auto">
        <div className="flex justify-between mt-2 mb-6">
          <h1 className="font-bold text-2xl">利用契約</h1>
        </div>
        <div className="bg-white rounded-xl border border-[#E1E1DF]">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="border-t border-b border-[#E1E1DF] pb-4 mb-4">
              <div className="min-h-[200px] whitespace-pre-wrap my-6">
                <h2 className="text-lg sm:text-xl font-bold mb-2">
                  DOCSHUND サービス利用契約
                </h2>
                <p className="mb-2">最終更新日: 2025年2月6日</p>
                <p className="mb-2">
                  本サービス利用契約（以下「契約」）は、DOCSHUND（以下「サービス」）を提供する[運営主体]（以下「会社」）とサービスを利用するユーザー（以下「会員」）との権利、義務及び責任事項を規定します。
                </p>
                <p className="mb-2">
                  DOCSHUNDはApache 2.0ライセンスを基に公式文書翻訳及び
                  学習を支援するプラットフォームです。本サービスを利用する前に必ず
                  本契約を熟読し、同意の上でご利用ください。
                </p>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第1条 (目的)
                </h3>
                <p className="mb-2">
                  この契約は、DOCSHUNDサービスの利用に関して、会社と会員との
                  権利、義務、責任事項及びその他必要な事項を規定することを目的とします。
                </p>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第2条 (用語の定義)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    サービス: 会社が提供する公式文書翻訳及び学習プラットフォームを
                    意味します。
                  </li>
                  <li>
                    会員: 本契約に同意し、サービスを利用する者を意味します。
                  </li>
                  <li>
                    コンテンツ: サービス内で提供されるか、会員が生成する翻訳、
                    投稿、コメントなどの資料を意味します。
                  </li>
                  <li>
                    管理者: 会社が指定したサービス運営及び管理を担当する者を
                    意味します。
                  </li>
                  <li>
                    Apache 2.0ライセンス: DOCSHUNDが遵守するオープンソース
                    ライセンスで、公式文書翻訳が許可された場合にのみ提供されます。
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第3条 (サービス利用契約及びアカウント管理)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    会員登録はGoogleおよびGitHubアカウントを利用したソーシャルログイン
                    のみで可能です。
                  </li>
                  <li>
                    初回ログイン時、会員はニックネームを必須入力する必要があり、
                    そのニックネームはユニークでなければなりません。
                  </li>
                  <li>
                    会員はプロフィール情報（ニックネーム、プロフィール写真、興味技術など）を
                    修正することができ、ニックネーム変更時には運営ポリシーに従って変更が
                    制限される場合があります。
                  </li>
                  <li>
                    会社は次のような事由が発生した場合、会員のサービス利用を
                    制限することができます。
                    <ul className="list-disc list-inside ml-4">
                      <li>他人のアカウントを盗用したり、虚偽の情報を入力した場合</li>
                      <li>
                        不適切なニックネームを使用した場合（暴言、嫌悪表現、広告性
                        ニックネームなど）
                      </li>
                      <li>その他本規約に違反する行為を行った場合</li>
                    </ul>
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第4条 (サービス利用ポリシー及び制限事項)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    本サービスは公式文書の翻訳及び学習を目的としており、会員は
                    これを商業的目的で利用することはできません。
                  </li>
                  <li>
                    著作権及びライセンス遵守:
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        DOCSHUNDはApache 2.0ライセンスを基にしており、該当
                        ライセンスに従って翻訳が許可された公式文書のみをサービスに
                        含めます。
                      </li>
                      <li>
                        翻訳された文書の著作権は原著作権者に帰属し、
                        DOCSHUNDは翻訳された文書の所有権を主張しません。
                      </li>
                      <li>
                        会員が直接翻訳を提供する場合、該当翻訳がApache 2.0
                        ライセンス及び原著作物のライセンスを遵守しているか確認する必要があります。
                      </li>
                      <li>
                        著作権問題が発生した場合、会社は直ちに該当文書を削除することができます。
                      </li>
                    </ul>
                  </li>
                  <li>
                    会員がアップロードするコンテンツ（翻訳、投稿、コメント、チャットなど）は
                    次のような事項を遵守する必要があります。
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        侮辱語、暴言、嫌悪表現、セクハラ、差別的発言を
                        含んではいけません。
                      </li>
                      <li>他人の著作権を侵害してはなりません。</li>
                      <li>虚偽の情報及び虚偽の事実を流布してはなりません。</li>
                      <li>広告、スパム、フィッシングリンクを含んではいけません。</li>
                      <li>
                        その他公序良俗に反する内容が含まれてはなりません。
                      </li>
                    </ul>
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第5条 (公式文書ライセンス及び翻訳コンテンツ提供ポリシー)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    DOCSHUNDは公式文書のライセンスを厳密に検討し、Apache 2.0
                    ライセンスが適用された文書または再配布及び翻訳が許可された文書のみを
                    提供します。
                  </li>
                  <li>
                    翻訳が許可されていない文書は提供できず、該当文書の
                    翻訳が必要な場合はライセンス保有者の承認を得る必要があります。
                  </li>
                  <li>
                    会員がリクエストした翻訳文書は一定基準以上のリクエストが蓄積された
                    場合、会社がライセンスを検討した上で提供の可否を決定します。
                  </li>
                  <li>
                    翻訳された文書は共同作業を基にしており、会員は翻訳を
                    提案し修正することができます。
                  </li>
                  <li>
                    特定の文段に対する翻訳は投票システムを通じて最適な翻訳が
                    選択され、最も推薦された翻訳が基本翻訳として反映されます。
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第6条 (報告ポリシー及び利用制限)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    サービス内で報告機能を通じて不適切なコンテンツ及びユーザー
                    行動を報告することができます。
                  </li>
                  <li>
                    報告されたコンテンツは管理者が検討し、報告回数が一定基準を
                    超えた場合は自動的に非表示処理されることがあります。
                  </li>
                  <li>
                    報告対象となる項目は次のとおりです。
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        侮辱語、暴言、嫌悪表現を含む投稿/コメント/翻訳/チャット
                      </li>
                      <li>著作権を侵害したコンテンツ</li>
                      <li>広告、スパム、フィッシングリンクを含むコンテンツ</li>
                      <li>その他不適切なコンテンツ</li>
                    </ul>
                  </li>
                  <li>
                    報告が累積されたユーザーは一定期間サービス利用が制限されるか
                    アカウントが停止されることがあります。
                  </li>
                  <li>
                    報告処理過程で会員に弁明の機会が与えられ、管理者の
                    最終判断により措置が講じられます。
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第7条 (会員退会及びサービス終了)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    会員はいつでもサービス内で退会申請を行うことができ、退会
                    直後にアカウント情報が削除されます。
                  </li>
                  <li>
                    ただし、会員が作成した翻訳文、投稿、コメント、チャットは
                    公益的な目的のために削除されない場合があります。
                  </li>
                  <li>
                    会社は次のような理由によりサービス運営を中断することができます。
                    <ul className="list-disc list-inside ml-4">
                      <li>著作権問題またはライセンス変更</li>
                      <li>技術的問題または運営上の困難</li>
                      <li>その他不可抗力的な理由</li>
                    </ul>
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第8条 (責任の限界及び免責条項)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    DOCSHUNDは会員が提供した翻訳文の正確性、信頼性を保証せず、
                    会員は翻訳を使用する際に自ら確認する責任があります。
                    있습니다.
                  </li>
                  <li>
                    会社は会員間の紛争及び法的問題に介入せず、すべての
                    責任は該当会員にあります。
                  </li>
                  <li>
                    サービスは「現状有姿（AS-IS）」で提供され、技術的
                    エラーまたは予期しない障害が発生する可能性があります。
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  第9条 (約款変更及び公告)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    本約款はサービス運営及び法律変更により改定されることがあり、
                    変更時には最低7日前に公告されます。
                  </li>
                  <li>
                    変更された約款に同意しない場合、会員はサービス利用を
                    中断し退会することができます。
                  </li>
                  <li>
                    公告後にもサービスを引き続き利用する場合、変更された約款に同意した
                    ものとみなされます。
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  附則
                </h3>
                <p>本約款は2025年2月6日から適用されます。</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
