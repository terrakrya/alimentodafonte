<template>
<div class="receipt">
	<loading :loading="isLoading" />
  <div class="invoice-box" v-if="stock_in">
    <table cellpadding="0" cellspacing="0">
      <tr class="top">
        <td colspan="3">
          <table>
            <tr>
              <td class="title">
								<div class="brand">
									<h1 class="logo"><a><span>REDE</span> de <strong>sementes</strong></a></h1>
								</div>

              </td>

              <td>
								<h4><strong>Recibo de entrega</strong></h4>
                Data: {{stock_in.createdAt | moment("DD/MM/YYYY H:mm")}}<br>
                Lote: {{stock_in.lot.code}}<br>
								Cód: <small>{{stock_in._id}}</small><br>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr class="information">
        <td colspan="3">
          <table>
            <tr>
              <td>
                <strong>Recebido por:</strong><br>
								<span v-if="stock_in.seeds_house">{{stock_in.seeds_house.name}}<br></span>
								<span v-if="stock_in.createdBy">{{stock_in.createdBy.name}}<br></span>
              </td>

              <td>
                <strong>Entregue por:</strong><br>
                <span v-if="stock_in.collectors_group">{{stock_in.collectors_group.name}}<br></span>
                <span v-if="stock_in.collector">{{stock_in.collector.name}}<br></span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr class="heading">
        <td>
          Semente
        </td>
        <td>
          Quantidade
        </td>
        <td>
          Valor pago
        </td>
      </tr>
      <tr class="details">
        <td>{{stock_in.seed.name}}</td>
        <td>{{stock_in.qtd}} kg</td>
        <td>{{stock_in.compensation_collect | currency('R$ ', 2, { decimalSeparator: ',', thousandsSeparator: '.' })}}</td>
      </tr>

    </table>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'

export default {

  name: 'StockInReceipt',

  data() {
    return {
      stock_in: null
    }
  },
  created() {
    this.isLoading = true
    axios.get('stock_in/' + this.$route.params.id, {
      params: {
        populate: 'collectors_group collector seed seeds_house lot createdBy'
      }
    }).then(response => {
      this.stock_in = response.data
      this.isLoading = false
			setTimeout(() => {
				window.print();
			}, 2000);
    }).catch(this.showError);
  },
  components: {
    'loading': Loading,
  }

};
</script>
