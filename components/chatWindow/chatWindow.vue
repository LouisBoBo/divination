<template>
	<div class="chat-container">
		<div v-if="loadingHistory" class="loading-history">加载中...</div>
		<!-- 消息区域 -->
		<div class="message-list" ref="messageList" @scroll="handleScroll">
			<div v-for="(message, index) in messages" :key="index"
				:class="['message-item', message.isUser ? 'user' : 'ai']">
				<image class="avatar" :style="{ marginRight: message.isUser ? '0px' : '10px' }" :src="message.isUser ? userInfo.pic || '/static/reference1@2x.png'
              : '/static/luna.png'"></image>
				<div class="content">
					<!-- AI消息状态提示，仅AI消息且内容为空时显示 -->
					<template v-if="!message.isUser && !message.content">
						<span v-if="message.status === 'thinking'">
							<span class="loading"></span>
						</span>
						<span v-else-if="message.status === 'replying'">💬 正在回复中...</span>
						<span v-else-if="message.status === 'finished'"></span>
					</template>
					<!-- 渲染内容 -->
					<span v-else>
						<!-- <span v-html="sanitize(message.content)"></span> -->

						<div v-html="renderMarkdown(message.content)"></div>
						<!-- AI消息操作按钮 -->
						<template v-if="!message.isUser && message.status === 'finished'">
						</template>
					</span>
				</div>
			</div>
		</div>

		<!-- 输入区域 -->
		<div class="input-area">
			<u-image src="@/static/jianpan.png" mode="aspectFill" width="24px" height="24px" style="margin-left: 16px"
				@click="keyWorkClick"></u-image>
			<u--textarea class="inputView" v-model="inputContent" ref="textInput" placeholder="您想问老师的问题" height="46px"
				border="none" style="flex: 1; border-radius: 8px; margin: 0 10px" autoHeight :focus="focusInput"
				@blur="focusInput = false" @keydown.enter.prevent="handleSend"></u--textarea>
			<button @click="handleSend">
				<u-image src="@/static/send@2x.png" mode="aspectFill" width="24px" height="24px"></u-image>
			</button>
		</div>
	</div>
</template>

<script>
	import sanitizeHtml from "sanitize-html";
	import uImage from "@/uni_modules/uview-ui/components/u--image/u--image.vue";
	import Api from "@/api/luna/index.js";
	import {
		marked
	} from "marked";
	import DOMPurify from "dompurify"; // 用于净化HTML，防止XSS攻击

	export default {
		components: {
			uImage,
		},
		data() {
			return {
				messages: [],
				inputContent: "",
				focusInput: false,
				typingIndex: null, // 当前正在打字的消息索引
				typingContent: "", // 当前打字内容
				eventSource: null,
				aiReplyTimeout: null, // AI回复超时定时器
				pageNum: 1, //消息分页当前页
				loadingHistory: false,
				userInfo: {},
				messageListScrollTop: 0, //消息列表当前滑动位置
			};
		},

		onShow() {
			this.$nextTick(() => {
				debugger
				this.restoreScroll();
			});
		},

		methods: {
			renderMarkdown(content) {
				// 使用marked解析markdown，并使用DOMPurify净化HTML
				// return DOMPurify.sanitize(marked(content));

				let html = DOMPurify.sanitize(marked(content));
				// 去除结尾的 <br>、换行和空<p>
				html = html.replace(/(<br\s*\/?>|\n|<p>(\s|<br\s*\/?>)*<\/p>)+$/gi, "");
				return html;
			},

			// 注册SEE
			initSEE(fresh) {

				if (!fresh || this.messages.length == 0) {
					this.pageNum = 1;
					this.getHisttory(); //获取历史消息
				} else {
					this.restoreScroll(); //
				}

				let token = uni.getStorageSync(this.$config.storage.token);
				this.userInfo = uni.getStorageSync(this.$config.storage.userInfo);

				let url =
					Api.sse +
					"?version=V1.32&id=1&appVersion=V3.8.7&channel=68" +
					`&token=${token}`;
				const eventSource = new EventSource(
					url, // 替换为你的SSE服务端地址
					{
						withCredentials: true, // 需要发送cookies/HTTP认证时使用
					}
				);

				// 连接状态
				eventSource.onopen = () => {
					// 连接成功
					if (typeof callback === "function") {
						console.log("SSE连接成功");
					} else {
						console.log("SSE连接失败");
					}
				};

				// 监听默认消息（没有event字段的消息）
				eventSource.onmessage = (event) => {
					console.log("新消息:", event.data);
					if (event.data) {
						// 这里假设event.data是一个JSON字符串，解析它
						const data = JSON.parse(event.data);
						// 更新AI消息内容和状态
						if (typeof this.typingIndex === "number") {
							this.typeAIReplyContent(data.message, this.typingIndex);
						}
					}
				};

				// 监听自定义事件类型
				eventSource.addEventListener("customEvent", function(event) {
					console.log("自定义事件:", event.data);
				});

				// 错误处理
				eventSource.onerror = function(error) {
					console.error("SSE错误:", error);
					// 会自动尝试重新连接
				};

				this.eventSource = eventSource;
			},

			// 关闭SSE连接
			closeSEE() {
				if (this.eventSource) {
					this.eventSource.close();
					console.log("SSE连接已关闭");
				}
			},

			sanitize(html) {
				return sanitizeHtml(html, {
					allowedTags: ["b", "i", "u", "p", "br", "code", "pre", "a"],
					allowedAttributes: {
						a: ["href", "target"],
					},
				});
			},

			// 键盘弹起事件
			keyWorkClick() {
				// 让输入框获取焦点，弹起键盘
				this.focusInput = false; // 先重置，确保每次都能聚焦
				this.$nextTick(() => {
					this.focusInput = true;
				});
			},

			// 分块HTML内容
			// 这里使用了一个简单的正则表达式来分块HTML内容
			splitHtmlBlocks(html) {
				// 简单分块：按 <ul>...</ul>、<pre>...</pre>、<p>...</p>、<h3>...</h3>、<li>...</li>、<br>、\n
				const blockReg =
					/(<ul[\s\S]*?<\/ul>|<pre[\s\S]*?<\/pre>|<h\d[\s\S]*?<\/h\d>|<p[\s\S]*?<\/p>|<li[\s\S]*?<\/li>|<br\s*\/?>|\n)/gi;
				let blocks = html.split(blockReg).filter((b) => b && b.trim());
				// 合并相邻纯文本
				let merged = [];
				for (let b of blocks) {
					if (!b.match(/^</)) {
						if (merged.length && !merged[merged.length - 1].match(/^</)) {
							merged[merged.length - 1] += b;
						} else {
							merged.push(b);
						}
					} else {
						merged.push(b);
					}
				}
				return merged;
			},

			// 用户点击发送
			async handleSend() {
				let token = uni.getStorageSync(this.$config.storage.token);
				if (!token) {
					this.$emit("unlogin");
					return;
				}
				if (!this.inputContent.trim()) {
					this.$u.toast("请输入想问老师的问题！");
					return;
				}

				// 用户消息
				this.messages.push({
					content: this.inputContent,
					isUser: true,
					timestamp: new Date(),
				});
				const content = this.inputContent;
				this.typingContent = content;
				this.inputContent = "";

				this.$nextTick(() => {
					this.sendMessage(content);
					this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight;
				});
			},

			// 发送消息
			sendMessage(message) {
				this.$http
					.post(Api.sendMessage, {
						params: {
							msg: message,
						},
					})
					.then((res) => {
						console.log("请求结果=", res);
						if (res.status === "1") {
							// 添加一条AI消息，状态为思考中
							this.addThinkingAIMessage();
							console.log("发送成功");
						} else {
							this.$emit("notNumber", 2);
							// if (res.message && res.message.includes("您的占卜次数已不足")) {
							// 	this.$emit("notNumber", 2);
							// } else if (res.message && res.message.includes("没有次数")) {
							// 	this.$emit("notNumber", 1);
							// }
						}
					});
			},

			addThinkingAIMessage() {
				// 只插入一条空AI消息，状态为thinking
				this.messages.push({
					content: "",
					isUser: false,
					timestamp: new Date(),
					status: "thinking",
				});
				// 记录当前AI消息索引，方便后续更新
				this.typingIndex = this.messages.length - 1;

				// 清除旧定时器，启动新定时器
				if (this.aiReplyTimeout) clearTimeout(this.aiReplyTimeout);
				this.aiReplyTimeout = setTimeout(() => {
					// 超时未收到AI回复
					if (
						typeof this.typingIndex === "number" &&
						this.messages[this.typingIndex] &&
						this.messages[this.typingIndex].status === "thinking"
					) {
						this.messages[this.typingIndex].content = "系统繁忙请重试！";
						this.messages[this.typingIndex].status = "finished";

						// this.$u.toast("接收超时，请重新生成");
					}
				}, 180000); // 3分钟
			},

			async typeAIReplyContent(content, index) {
				this.messages[index].content = "";
				this.messages[index].status = "replying";
				const typingConfig = {
					charDelay: 30,
					tagDelay: 10,
					cursorBlink: true,
				};

				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = content;

				const processNode = async (node) => {
					if (node.nodeType === Node.TEXT_NODE) {
						await this.typeTextNode(node, index, typingConfig);
					} else if (node.nodeType === Node.ELEMENT_NODE) {
						await this.typeElementNode(node, index, typingConfig, walkNodes);
					}
				};

				const walkNodes = async (parentNode, index, config) => {
					for (const node of parentNode.childNodes) {
						await processNode(node);
					}
				};

				if (typingConfig.cursorBlink) {
					this.showCursor = true;
				}

				await walkNodes(tempDiv, index, typingConfig);

				if (typingConfig.cursorBlink) {
					this.showCursor = false;
				}

				this.messages[index].status = "finished";
				this.typingIndex = null;

				// 清除超时定时器
				if (this.aiReplyTimeout) {
					clearTimeout(this.aiReplyTimeout);
					this.aiReplyTimeout = null;
				}
				this.$nextTick(() => {
					debugger;
					this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight;
				});
			},
			/**
			 * 统一AI回复流程
			 * @param {String} content 用户消息内容
			 * @param {Number} [insertIndex] 可选，指定插入AI消息的位置（用于重试）
			 */
			async aiReply(ucontent, acontent, insertIndex) {
				// 1. 插入AI消息“正在思考中”
				const aiMsg = {
					content: "",
					isUser: false,
					timestamp: new Date(),
					status: "thinking",
				};
				let typingIndex;
				if (typeof insertIndex === "number") {
					this.messages.splice(insertIndex, 0, aiMsg);
					typingIndex = insertIndex;
				} else {
					this.messages[this.typingIndex].content = acontent;
					this.messages[this.typingIndex].status = "finished";
					this.typingIndex = null; // 用完清空
				}

				// 2. 获取AI回复，切换为“正在回复中”
				const aiResponse = await this.mockAIResponse(ucontent, acontent);
				this.messages[typingIndex].content = "";
				this.messages[typingIndex].status = "replying";

				const typingConfig = {
					charDelay: 30,
					tagDelay: 10,
					cursorBlink: true,
				};

				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = aiResponse;

				const processNode = async (node) => {
					if (node.nodeType === Node.TEXT_NODE) {
						await this.typeTextNode(node, typingIndex, typingConfig);
					} else if (node.nodeType === Node.ELEMENT_NODE) {
						await this.typeElementNode(
							node,
							typingIndex,
							typingConfig,
							walkNodes
						);
					}
				};

				const walkNodes = async (parentNode, index, config) => {
					for (const node of parentNode.childNodes) {
						await processNode(node);
					}
				};

				if (typingConfig.cursorBlink) {
					this.showCursor = true;
				}

				await walkNodes(tempDiv, typingIndex, typingConfig);

				if (typingConfig.cursorBlink) {
					this.showCursor = false;
				}

				// 3. 回复结束
				this.messages[typingIndex].status = "finished";

				this.$nextTick(() => {
					debugger;
					this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight;
				});
			},

			// 新增文本节点处理方法
			typeTextNode(node, index, config) {
				return new Promise((resolve) => {
					let text = node.textContent;
					let charIndex = 0;

					const typeChar = () => {
						if (charIndex < text.length) {
							this.messages[index].content += text[charIndex];
							charIndex++;
							this.$nextTick(() => {
								if (this.$refs.messageList) {
									debugger;
									this.$refs.messageList.scrollTop =
										this.$refs.messageList.scrollHeight;
								}
							});
							setTimeout(typeChar, config.charDelay);
						} else {
							resolve();
						}
					};

					typeChar();
				});
			},

			// 新增元素节点处理方法
			typeElementNode(node, index, config, walkNodes) {
				return new Promise(async (resolve) => {
					// 添加开始标签
					const startTag = `<${node.tagName.toLowerCase()}${this.getAttributes(
          node
        )}>`;
					this.messages[index].content += startTag;
					this.$nextTick(() => {
						if (this.$refs.messageList) {
							debugger;
							this.$refs.messageList.scrollTop =
								this.$refs.messageList.scrollHeight;
						}
					});

					// 处理子节点
					if (node.childNodes.length > 0) {
						await walkNodes(node, index, config);
					}

					// 添加结束标签
					const endTag = `</${node.tagName.toLowerCase()}>`;
					setTimeout(() => {
						this.messages[index].content += endTag;
						this.$nextTick(() => {
							debugger;
							if (this.$refs.messageList) {
								this.$refs.messageList.scrollTop =
									this.$refs.messageList.scrollHeight;
							}
						});
						resolve();
					}, config.tagDelay);
				});
			},

			// 辅助方法：获取元素属性
			getAttributes(element) {
				return Array.from(element.attributes)
					.map((attr) => ` ${attr.name}="${attr.value}"`)
					.join("");
			},

			mockAIResponse(userInput, accontent) {
				return new Promise((resolve) => {
					setTimeout(() => {
						const responses = {
							hello: "你好！有什么可以帮助你的吗？",
							code: accontent,
							default: `已收到：<b>${userInput}</b>，我正在思考...`,
						};
						// 优先匹配 hello 或 code，否则返回 default
						if (responses[userInput.toLowerCase()]) {
							resolve(responses[userInput.toLowerCase()]);
						} else {
							resolve(`<b style="display: block;">${responses.code}</b>`);
						}
					}, 1000);
				});
			},

			// 重新回复
			retryMessage(index) {
				if (this.aiReplyTimeout) {
					clearTimeout(this.aiReplyTimeout);
					this.aiReplyTimeout = null;
				}

				this.$set(this.messages[index], "retried", true);
				setTimeout(() => {
					this.$set(this.messages[index], "retried", false);
				}, 1200);
				// 找到本条AI消息前最近一条用户消息
				const userMsg = this.messages
					.slice(0, index)
					.reverse()
					.find((msg) => msg.isUser);
				if (userMsg) {
					// 删除AI消息
					this.messages.splice(index, 1);
					this.typingIndex = index;
					this.typingContent = userMsg.content;
					// 重新发送用户消息，触发新的AI回复
					this.sendMessage(userMsg.content);
				}
			},

			async getHisttory() {
				const oldScrollHeight = this.$refs.messageList ?
					this.$refs.messageList.scrollHeight :
					0;
				const oldScrollTop = this.$refs.messageList ?
					this.$refs.messageList.scrollTop :
					0;

				this.$http
					.get(Api.historyList, {
						params: {
							order: "desc",
							sort: "chat_list.id",
							pageSize: 30,
							curPage: this.pageNum,
						},
					})
					.then((res) => {
						console.log("请求结果^^^^^^=", res);
						if (res.status === "1") {
							let listData = res.list;
							//将lisData倒序
							listData = listData.reverse();

							let messageData = listData.map((item) => ({
								...item,
								content: item.message,
								isUser: item.role == "user", // 适配字段
								status: "finished", // 历史消息一般为已完成
								timestamp: item.add_time || new Date(), // 如有时间戳则用，否则用当前时间
							}));

							//将消息加到消息列表
							if (this.pageNum == 1) {
								this.messages = messageData;
								this.$nextTick(() => {
									debugger;
									this.$refs.messageList.scrollTop =
										this.$refs.messageList.scrollHeight;
								});
							} else {
								this.messages = [...messageData, ...this.messages];
								this.$nextTick(() => {
									debugger;
									// 新消息加在前面后，保持原有滚动位置
									const newScrollHeight = this.$refs.messageList ?
										this.$refs.messageList.scrollHeight :
										0;
									if (this.$refs.messageList) {
										this.$refs.messageList.scrollTop =
											newScrollHeight - oldScrollHeight + oldScrollTop;
									}
								});
							}

							this.pageNum++;
						} else {}
					});
			},

			async loadMoreHistory() {
				if (this.loadingHistory) return;
				this.loadingHistory = true;
				await this.getHisttory();
				this.loadingHistory = false;
			},

			handleScroll(e) {
				let scrollTop = 0;
				// 1. 优先用事件对象
				if (e && e.target && typeof e.target.scrollTop === "number") {
					scrollTop = e.target.scrollTop;
				}
				// 2. 退而求其次用 $refs
				else if (
					this.$refs.messageList &&
					typeof this.$refs.messageList.scrollTop === "number"
				) {
					scrollTop = this.$refs.messageList.scrollTop;
				}
				// 3. 兜底：尝试用原生DOM
				else if (
					this.$refs.messageList &&
					this.$refs.messageList.$el &&
					typeof this.$refs.messageList.$el.scrollTop === "number"
				) {
					scrollTop = this.$refs.messageList.$el.scrollTop;
				}

				// 实时保存
				this.messageListScrollTop = scrollTop;

				// 滚动到顶部时加载更多
				if (scrollTop <= 0 && !this.loadingHistory) {
					this.loadMoreHistory();
				}
			},

			restoreScroll() {
				this.$nextTick(() => {
					if (this.$refs.messageList) {
						this.$refs.messageList.scrollTop = this.messageListScrollTop || this.$refs.messageList.$el
							.scrollTop;
					}
				});
			},
		},
	};
</script>

<style scoped>
	.chat-container {
		height: calc(100vh - 58px);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		background-color: greenyellow;
		/* 保证input-area绝对定位在底部 */
	}

	.message-list {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
		background-color: #f4f7f9;
	}

	.message-item {
		margin: 15px 0;
		display: flex;
		align-items: flex-start;
	}

	.avatar {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		font-size: 24px;
		margin-right: 0px;
	}

	.content {
		position: relative;
		max-width: 75%;
		padding: 12px 12px;
		border-radius: 8px;
		line-height: 1.5;
		word-break: break-word;
		min-height: 1.1em;
		/* 根据实际字体大小调整 */
		white-space: pre-wrap;
		margin-bottom: 20px;
	}

	.user {
		flex-direction: row-reverse;
	}

	.user .content {
		background: #59b143;
		color: white;
		margin-right: 15px;
		border-radius: 8px 8px 8px 8px;
	}

	.user .content::after {
		content: "";
		position: absolute;
		right: -8px;
		top: 12px;
		width: 0;
		height: 0;
		border-top: 8px solid transparent;
		border-bottom: 8px solid transparent;
		border-left: 8px solid #59b143;
	}

	.ai .content {
		min-width: 70%;
		padding-top: 0;
		margin-bottom: 0px;
	}

	.ai-actions {
		position: absolute;
		right: 10px;
		bottom: 0px;
		float: right;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 6px;
		/* 按钮间距 */
		z-index: 2;
	}

	.ai-action-btn {
		background: none;
		border: none;
		box-shadow: none;
		color: #59b143;
		cursor: pointer;
		margin: 0 2px;
		font-size: 16px;
		padding: 2px;
		border-radius: 4px;
		transition: background 0.2s;
	}

	.ai-action-btn:hover {
		background: none;
	}

	.ai-action-btn.active svg {
		color: #ff4c51;
		/* 或你喜欢的高亮色 */
		filter: drop-shadow(0 0 2px #ff4c51);
	}

	.ai-action-btn svg {
		color: #bbb;
		transition: color 0.2s;
	}

	.input-area {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		min-height: 46px;
		background-color: #f3f7f9;

		.inputView {
			flex: 1;
		}
	}

	.text-input {
		flex: 1;
		min-height: 36px;
		/* max-height: 50px; */
		/* 调小最大高度 */
		margin-right: 12px;
		background: #fff;
		border-radius: 4px;
		border: 1px solid #eee;
		padding: 4px 12px;
		/* 减小上下内边距 */
		font-size: 16px;
		outline: none;
		resize: none;
		box-sizing: border-box;
		line-height: 1.5;
		overflow-y: auto;
	}

	.quill-editor {
		flex: 1;
		min-height: 36px;
		margin-right: 12px;
		background: #fff;
		border-radius: 4px;
		border: 1px solid #eee;
		display: flex;
		align-items: center;
	}

	button {
		margin-right: 16px;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 36px;
		line-height: 36px;
		background: #59b143;
		border-radius: 18px 18px 18px 18px;
	}

	pre {
		background: #f6f8fa;
		padding: 12px;
		border-radius: 4px;
		overflow-x: auto;
	}

	code {
		font-family: Consolas, Monaco, monospace;
	}

	a {
		color: #1890ff;
		text-decoration: none;
	}

	.loading {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid #bbb;
		border-top: 2px solid #fff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		vertical-align: middle;
		margin-right: 6px;
		margin-top: -2px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>